from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests
import os
from cachetools import TTLCache
import time
import logging
from fuzzywuzzy import fuzz
from scholarly import scholarly
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader  # For PDF text extraction

app = Flask(__name__)
CORS(app)

# Initialize cache with a TTL of 10 minutes and a max size of 100 items
cache = TTLCache(maxsize=100, ttl=600)

# Set up logging to monitor API response times
logging.basicConfig(level=logging.INFO)

# Groq API configuration
GROQ_API_URL = "https://api.groq.com/v1/summarize"  # Replace with the actual Groq API endpoint
GROQ_API_KEY = os.getenv("GROQ_API_KEY","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")  # Load Groq API key from environment variables

# Welcome message for the home route
@app.route('/')
def home():
    return render_template('index.html')

# Load API Key from environment variable
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')  # Replace with your actual default API key

# Scopus Journal search API endpoint
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"

# Function to make requests with exponential backoff for reliability
def fetch_with_backoff(url, params, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response
            time.sleep(2 ** attempt)  # Exponential backoff
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error: {e}")
    return None

# # Endpoint to search for journal status and matching journals
# @app.route('/api/journal', methods=['GET'])
# def get_journal_status():
#     journal_name = request.args.get('title')
    
#     # Check if the journal name is provided
#     if not journal_name:
#         return jsonify({'error': 'Journal title is required.'}), 400
    
#     # Check cache first to avoid redundant API calls
#     if journal_name in cache:
#         return jsonify(cache[journal_name])
    
#     params = {'title': journal_name, 'apiKey': API_KEY}
#     response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
#     if response:
#         data = response.json()
#         if 'serial-metadata-response' in data:
#             journal_info = data['serial-metadata-response'].get('entry', [])
#             if journal_info:
#                 results = []
#                 for journal in journal_info[:5]:  # Limit to top 5 journals
#                     journal_title = journal.get('dc:title', 'Unknown')
#                     issn = journal.get('prism:issn', 'N/A')
#                     publisher_name = journal.get('dc:publisher', 'N/A')
#                     links = journal.get('link', [])
                    
#                     discontinued_date = journal.get('coverageEndYear', None)
#                     status_text = f"Scopus Indexed but discontinued from {discontinued_date}" if discontinued_date else "Scopus Indexed"

#                     result = {
#                         'journal_title': journal_title,
#                         'issn': issn,
#                         'publisher': publisher_name,
#                         'status': status_text,
#                         'discontinued_date': discontinued_date,
#                         'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links]
#                     }
#                     results.append(result)
                
#                 cache[journal_name] = results  # Store results in cache
#                 return jsonify(results)
#             return jsonify({'journal_title': journal_name, 'status': "Not Scopus Indexed"}), 404
#     return jsonify({'error': "Failed to fetch data from Scopus API."}), 500

# Enhanced Suggestions Algorithm with TF-IDF for keyword search
@app.route('/api/journal/suggestions', methods=['GET'])
def get_journal_suggestions():
    partial_title = request.args.get('title')
    
    if not partial_title:
        return jsonify({'error': 'Partial title is required.'}), 400
    
    params = {'title': partial_title, 'apiKey': API_KEY}
    response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
    
    if response:
        data = response.json()
        if 'serial-metadata-response' in data:
            journal_info = data['serial-metadata-response'].get('entry', [])
            journal_titles = [journal.get('dc:title', 'Unknown') for journal in journal_info]
            
            # Use TF-IDF to find the most relevant journals
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(journal_titles)
            query_vector = vectorizer.transform([partial_title])
            
            # Calculate cosine similarity between the query and all journal titles
            cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
            
            # Get indices of the top matches
            top_indices = cosine_similarities.argsort()[-5:][::-1]  # Top 5 matches
            
            suggestions = []
            for index in top_indices:
                journal_title = journal_titles[index]
                issn = journal_info[index].get('prism:issn', 'N/A')
                suggestions.append({'journal_title': journal_title, 'issn': issn})
            
            return jsonify(suggestions)
    return jsonify({'error': "Failed to fetch suggestions."}), 500

# Endpoint to get journal metrics with credibility score
@app.route('/api/journal/metrics', methods=['GET'])
def get_journal_metrics():
    issn = request.args.get('issn')

    if not issn:
        return jsonify({'error': 'ISSN is required.'}), 400

    url = f"https://api.elsevier.com/content/serial/title/issn/{issn}"
    headers = {'Accept': 'application/json', 'X-ELS-APIKey': API_KEY}

    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            print(f"Failed to fetch data: {response.status_code} - {response.text}")  # Log the error
            return jsonify({
                'error': f"Failed to fetch data from Scopus API. Status Code: {response.status_code}, Message: {response.text}"
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")  # Log the exception
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

# Chatbot prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    if not text:
        return jsonify({'answer': 'Please provide a message.'}), 400

    response = get_response(text)
    message = {'answer': response}
    return jsonify(message)

# OpenAlex API endpoint
OPENALEX_API = "https://api.openalex.org/works"

@app.route('/api/check-article', methods=['POST'])
def check_article():
    try:
        # Extract the article name from the request body
        data = request.json
        article_name = data.get('name', '').strip()

        # Validate the input
        if not article_name:
            return jsonify({"error": "Article name is required"}), 400

        # Query the OpenAlex API for similar articles
        params = {"search": article_name}
        response = requests.get(OPENALEX_API, params=params)

        # Check if the OpenAlex API returned a valid response
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from OpenAlex"}), 500

        # Parse the API response
        results = response.json().get("results", [])

        if results:
            # Use fuzzy matching to find the most relevant result
            best_match = None
            best_score = 0

            for result in results:
                title = result.get('display_name', '')
                score = fuzz.ratio(article_name.lower(), title.lower())

                if score > best_score:
                    best_score = score
                    best_match = result

            if best_score >= 70:  # Only return matches with a high similarity score
                return jsonify({
                    "similar": {
                        "name": best_match.get('display_name', 'No title available'),
                        "details": best_match.get('abstract_inverted_index', 'No abstract available')
                    }
                })

        # If no result matches or similarity is too low
        return jsonify({"similar": None})

    except Exception as e:
        # Handle unexpected errors gracefully
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# PDF Summarization Endpoint using Groq API
@app.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf():
    try:
        # Check if a file is uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        # Check if the file is a PDF
        if not file.filename.endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400

        # Extract text from the PDF
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

        # Ensure text is not empty
        if not text.strip():
            return jsonify({"error": "No text found in the PDF"}), 400

        # Call Groq API for summarization
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "text": text,
            "max_length": 130,  # Adjust as needed
            "min_length": 30,   # Adjust as needed
        }

        # Log the request payload (for debugging)
        logging.info(f"Sending request to Groq API with payload: {payload}")

        response = requests.post(GROQ_API_URL, headers=headers, json=payload)

        # Log the response (for debugging)
        logging.info(f"Groq API response: {response.status_code}, {response.text}")

        if response.status_code == 200:
            summary = response.json().get("summary", "")
            return jsonify({"summary": summary})
        else:
            return jsonify({
                "error": "Failed to summarize the text using Groq API",
                "details": response.text
            }), 500

    except Exception as e:
        logging.error(f"Error summarizing PDF: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Function to make requests with exponential backoff for reliability
def fetch_with_backoff(url, params, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response
            time.sleep(2 ** attempt)  # Exponential backoff
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error: {e}")
    return None

# Endpoint to search for journal status and matching journals
@app.route('/api/journal', methods=['GET'])
def get_journal_status():
    journal_name = request.args.get('title')
    
    # Check if the journal name is provided
    if not journal_name:
        return jsonify({'error': 'Journal title is required.'}), 400
    
    # Check cache first to avoid redundant API calls
    if journal_name in cache:
        return jsonify(cache[journal_name])
    
    params = {'title': journal_name, 'apiKey': API_KEY}
    response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
    if response:
        data = response.json()
        if 'serial-metadata-response' in data:
            journal_info = data['serial-metadata-response'].get('entry', [])
            if journal_info:
                results = []
                for journal in journal_info[:5]:  # Limit to top 5 journals
                    journal_title = journal.get('dc:title', 'Unknown')
                    issn = journal.get('prism:issn', 'N/A')
                    publisher_name = journal.get('dc:publisher', 'N/A')
                    links = journal.get('link', [])
                    
                    discontinued_date = journal.get('coverageEndYear', None)
                    status_text = f"Scopus Indexed but discontinued from {discontinued_date}" if discontinued_date else "Scopus Indexed"

                    result = {
                        'journal_title': journal_title,
                        'issn': issn,
                        'publisher': publisher_name,
                        'status': status_text,
                        'discontinued_date': discontinued_date,
                        'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links]
                    }
                    results.append(result)
                
                cache[journal_name] = results  # Store results in cache
                return jsonify(results)
            return jsonify({'journal_title': journal_name, 'status': "Not Scopus Indexed"}), 404
    return jsonify({'error': "Failed to fetch data from Scopus API."}), 500



# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)