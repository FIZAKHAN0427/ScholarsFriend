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
from PyPDF2 import PdfReader
from services.journal_service import fetch_journals
from concurrent.futures import ThreadPoolExecutor
from utils.logger import logger

app = Flask(__name__)
CORS(app)

# Initialize cache with a TTL of 10 minutes and a max size of 100 items
cache = TTLCache(maxsize=100, ttl=600)

# Set up logging to monitor API response times
logging.basicConfig(level=logging.INFO)

# Groq API configuration
GROQ_API_URL = "https://api.groq.com/v1/summarize"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

# Load API Key from environment variable
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')

# Scopus Journal search API endpoint
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"

# OpenAlex API endpoint
OPENALEX_API = "https://api.openalex.org/works"

@app.route('/')
def home():
    return render_template('index.html')

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
            
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(journal_titles)
            query_vector = vectorizer.transform([partial_title])
            
            cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
            top_indices = cosine_similarities.argsort()[-5:][::-1]
            
            suggestions = []
            for index in top_indices:
                journal_title = journal_titles[index]
                issn = journal_info[index].get('prism:issn', 'N/A')
                suggestions.append({'journal_title': journal_title, 'issn': issn})
            
            return jsonify(suggestions)
    return jsonify({'error': "Failed to fetch suggestions."}), 500

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
            print(f"Failed to fetch data: {response.status_code} - {response.text}")
            return jsonify({
                'error': f"Failed to fetch data from Scopus API. Status Code: {response.status_code}, Message: {response.text}"
            }), response.status_code
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    if not text:
        return jsonify({'answer': 'Please provide a message.'}), 400

    response = get_response(text)
    message = {'answer': response}
    return jsonify(message)

@app.route('/api/check-article', methods=['POST'])
def check_article():
    try:
        data = request.json
        article_name = data.get('name', '').strip()

        if not article_name:
            return jsonify({"error": "Article name is required"}), 400

        params = {"search": article_name}
        response = requests.get(OPENALEX_API, params=params)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from OpenAlex"}), 500

        results = response.json().get("results", [])

        if results:
            best_match = None
            best_score = 0

            for result in results:
                title = result.get('display_name', '')
                score = fuzz.ratio(article_name.lower(), title.lower())

                if score > best_score:
                    best_score = score
                    best_match = result

            if best_score >= 70:
                return jsonify({
                    "similar": {
                        "name": best_match.get('display_name', 'No title available'),
                        "details": best_match.get('abstract_inverted_index', 'No abstract available')
                    }
                })

        return jsonify({"similar": None})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        if not file.filename.endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400

        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

        if not text.strip():
            return jsonify({"error": "No text found in the PDF"}), 400

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "text": text,
            "max_length": 130,
            "min_length": 30,
        }

        logging.info(f"Sending request to Groq API with payload: {payload}")
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
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

@app.route('/api/journal', methods=['GET'])
def get_journal_status():
    journal_name = request.args.get('title')
    
    if not journal_name:
        return jsonify({'error': 'Journal title is required.'}), 400
    
    cache_key = f"{journal_name}_{str(request.args)}"
    if cache_key in cache:
        return jsonify(cache[cache_key])
    
    # Base parameters
    params = {
        'title': journal_name,
        'apiKey': API_KEY,
        'view': 'STANDARD'
    }
    
    # Filter mapping and value transformations
    if request.args.get('country'):
        params['country'] = request.args.get('country')
    
    if request.args.get('subjectArea'):
        params['subj'] = request.args.get('subjectArea')
    
    if request.args.get('indexing'):
        indexing = request.args.get('indexing')
        params['content'] = 'core' if indexing == 'scopus' else 'sci'
    
    if request.args.get('publicationYear'):
        params['year'] = request.args.get('publicationYear')
    
    if request.args.get('citeScoreMin'):
        params['citeScoreYearInfoList.citeScoreCurrentMetric'] = \
            f"{request.args.get('citeScoreMin')}-{request.args.get('citeScoreMax', '')}"
    
    if request.args.get('openAccess'):
        oa_value = request.args.get('openAccess')
        params['oa'] = 'full' if oa_value == '1' else 'partial' if oa_value == '2' else 'none'
    
    if request.args.get('publisher'):
        params['pub'] = request.args.get('publisher')
    
    if request.args.get('language'):
        params['language'] = request.args.get('language')
    
    if request.args.get('quartile'):
        params['citeScoreYearInfoList.citeScoreSubjectRank.quartile'] = request.args.get('quartile')
    
    headers = {
        'Accept': 'application/json',
        'X-ELS-APIKey': API_KEY
    }
    
    response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params=params, headers=headers)
    
    if response:
        data = response.json()
        if 'serial-metadata-response' in data:
            journal_info = data['serial-metadata-response'].get('entry', [])
            if journal_info:
                results = []
                for journal in journal_info:
                    result = {
                        'journal_title': journal.get('dc:title', 'Unknown'),
                        'issn': journal.get('prism:issn', 'N/A'),
                        'eissn': journal.get('prism:eissn', 'N/A'),
                        'publisher': journal.get('dc:publisher', 'N/A'),
                        'status': "Scopus Indexed",
                        'discontinued_date': journal.get('coverageEndYear'),
                        'subject_areas': ', '.join(
                            [area.get('$', '') for area in journal.get('subject-area', [])]
                        ) if journal.get('subject-area') else 'N/A',
                        'cite_score': journal.get('citeScoreYearInfoList', {}).get('citeScoreCurrentMetric', 'N/A'),
                        'quartile': journal.get('citeScoreYearInfoList', {}).get('citeScoreSubjectRank', {}).get('quartile', 'N/A'),
                        'open_access': journal.get('openaccess', 'N/A'),
                        'links': [{"title": link.get('@ref'), "href": link.get('@href')} 
                                for link in journal.get('link', [])]
                    }
                    
                    if journal.get('coverageEndYear'):
                        result['status'] = f"Discontinued since {journal.get('coverageEndYear')}"
                    
                    results.append(result)
                
                cache[cache_key] = results
                return jsonify(results)
            
            return jsonify({'journal_title': journal_name, 'status': "Not Scopus Indexed"}), 404
        
        return jsonify({'error': "Unexpected response format from Scopus API"}), 500
    
    return jsonify({'error': "Failed to fetch data from Scopus API"}), 500

@app.route('/api/search/journals', methods=['GET'])
def search_journals():
    """
    Search journals across multiple sources (DOAJ, IEEE, PubMed, Springer)
    """
    query = request.args.get('query', '').strip()
    open_access = request.args.get('open_access', '').lower() == 'true'
    indexing = request.args.get('indexing', '').strip()
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    filters = {
        'open_access': open_access,
        'indexing': indexing
    }
    
    try:
        logger.info(f"Journal search initiated - Query: '{query}', Filters: {filters}")
        
        results = fetch_journals(query, filters)
        
        logger.info(f"Journal search completed - Found {len(results)} results")
        
        return jsonify({
            'count': len(results),
            'results': results
        })
    except Exception as e:
        logger.error(f"Journal search failed - Query: '{query}', Error: {str(e)}")
        return jsonify({'error': 'Failed to search journals', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)