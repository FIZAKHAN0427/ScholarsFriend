from flask import Flask, request, jsonify, render_template
import requests
import os
import time
import logging
from flask_cors import CORS
from cachetools import TTLCache
from fuzzywuzzy import fuzz
from scholarly import scholarly

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Initialize cache (10 min TTL, max 100 items)
cache = TTLCache(maxsize=100, ttl=600)

# Load API Keys from environment variables
SCOPUS_API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')  
PUBMED_API_KEY = os.getenv('PUBMED_API_KEY', 'fd8ba36c72a355c80d9f2b56cb579b7be808')

# PubMed & Scopus API URLs
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"
PUBMED_SEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
PUBMED_SUMMARY_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Function to fetch API data with backoff
def fetch_with_backoff(url, params, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                return response
            logging.warning(f"API request failed, retrying... Attempt {attempt + 1}")
            time.sleep(2 ** attempt)  # Exponential backoff
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error: {e}")
    return None

# Function to check journal indexing in PubMed
def check_journal_indexing(journal_name):
    try:
        logging.info(f"Checking PubMed indexing for: {journal_name}")

        params = {
            "db": "nlmcatalog",
            "term": f"{journal_name}[Title]",
            "retmode": "json",
            "api_key": PUBMED_API_KEY
        }
        search_response = fetch_with_backoff(PUBMED_SEARCH_URL, params)

        if not search_response:
            return {"error": "Error with PubMed search API."}
        
        search_data = search_response.json()
        journal_ids = search_data.get('esearchresult', {}).get('idlist', [])

        if not journal_ids:
            return {"indexed": False, "message": f"{journal_name} is NOT indexed in PubMed."}

        nlm_id = journal_ids[0]
        summary_params = {"db": "nlmcatalog", "id": nlm_id, "retmode": "json", "api_key": PUBMED_API_KEY}
        summary_response = fetch_with_backoff(PUBMED_SUMMARY_URL, summary_params)

        if summary_response:
            journal_info = summary_response.json().get("result", {}).get(nlm_id, {})
            
            title = journal_info.get("titlemainlist", [{}])[0].get("title", "Unknown") if journal_info.get("titlemainlist") else "Unknown"
            pmid = journal_info.get("pmid", "N/A")
            publisher = journal_info.get("publicationinfolist", [{}])[0].get("publisher", "N/A") if journal_info.get("publicationinfolist") else "N/A"
            
            return {
                "indexed": True,
                "journal_title": title,
                "pmid": pmid,
                "publisher": publisher,
                "Status": "PubMed Indexed",
                "Indexing Status": "Not Indexed in MEDLINE" if journal_info.get("currentindexingstatus") == "N" else "Indexed in MEDLINE"
            }

        return {"indexed": False, "message": "PubMed entry not found."}

    except requests.exceptions.RequestException as e:
        logging.error(f"Error occurred while fetching PubMed data: {str(e)}")
        return {"error": "Error fetching data from PubMed"}

# API route to check journal status
@app.route('/api/journal', methods=['GET'])
def get_journal_status():
    journal_name = request.args.get('title')
    indexing = request.args.get('indexing')

    if not journal_name:
        return jsonify({'error': 'Journal title is required.'}), 400

    cache_key = f"{journal_name}_{indexing}"
    if cache_key in cache:
        return jsonify(cache[cache_key])

    result = None
    if not indexing or indexing == 'Scopus':
        params = {'title': journal_name, 'apiKey': SCOPUS_API_KEY}
        response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)

        if response:
            data = response.json()
            if 'serial-metadata-response' in data:
                journal_info = data['serial-metadata-response'].get('entry', [])
                if journal_info:
                    result = {
                        'journal_title': journal_info[0].get('dc:title', 'Unknown'),
                        'issn': journal_info[0].get('prism:issn', 'N/A'),
                        'publisher': journal_info[0].get('dc:publisher', 'N/A'),
                        'status': 'Scopus Indexed'
                    }

    if indexing == 'PubMed' or (not result and not indexing):
        pubmed_results = check_journal_indexing(journal_name)
        if pubmed_results:
            result = pubmed_results

    if result:
        cache[cache_key] = result
        return jsonify(result)

    return jsonify({'journal_title': journal_name, 'status': 'Not Indexed'}), 404

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
