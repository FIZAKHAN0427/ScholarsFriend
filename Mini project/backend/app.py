from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests
import os
from chat import get_response
from cachetools import TTLCache
import time
import logging
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app)

# Initialize cache with a TTL of 10 minutes and a max size of 100 items
cache = TTLCache(maxsize=100, ttl=600)

# Set up logging to monitor API response times
logging.basicConfig(level=logging.INFO)

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
                journal_title = journal_info[0].get('dc:title', 'Unknown')
                issn = journal_info[0].get('prism:issn', 'N/A')
                publisher_name = journal_info[0].get('dc:publisher', 'N/A')
                links = journal_info[0].get('link', [])
                
                discontinued_date = journal_info[0].get('coverageEndYear', None)
                status_text = f"Scopus Indexed but discontinued from {discontinued_date}" if discontinued_date else "Scopus Indexed"

                result = {
                    'journal_title': journal_title,
                    'issn': issn,
                    'publisher': publisher_name,
                    'status': status_text,
                    'discontinued_date': discontinued_date,
                    'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links]
                }
                cache[journal_name] = result  # Store result in cache
                return jsonify(result)
            return jsonify({'journal_title': journal_name, 'status': "Not Scopus Indexed"}), 404
    return jsonify({'error': "Failed to fetch data from Scopus API."}), 500

# Enhanced Suggestions Algorithm with Fuzzy Matching for keyword search
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
            suggestions = []
            for journal in journal_info:
                journal_title = journal.get('dc:title', 'Unknown')
                issn = journal.get('prism:issn', 'N/A')
                
                # Fuzzy match score
                match_score = fuzz.partial_ratio(partial_title.lower(), journal_title.lower())
                if match_score > 70:  # Suggest only if score is reasonably high
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

    response = fetch_with_backoff(url, headers=headers)
    
    if response:
        return jsonify(response.json())
    else:
        return jsonify({
            'error': f"Failed to fetch data from Scopus API. Status Code: {response.status_code}"
        }), 500

# Chatbot prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    if not text:
        return jsonify({'answer': 'Please provide a message.'}), 400

    response = get_response(text)
    message = {'answer': response}
    return jsonify(message)

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
