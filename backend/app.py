from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Flask API for Journal and Paper Search"

# Load API Key from environment variable
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')

# Scopus Journal search API endpoint
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"

# Endpoint to search for journal
@app.route('/api/journal', methods=['GET'])
def get_journal_status():
    journal_name = request.args.get('title')
    
    # Check if the journal name is provided
    if not journal_name:
        return jsonify({'error': 'Journal title is required.'}), 400
    
    params = {'title': journal_name, 'apiKey': API_KEY}
    try:
        response = requests.get(SCOPUS_API_JOURNAL_URL, params=params)

        if response.status_code == 200:
            data = response.json()

            # Check if 'serial-metadata-response' is in the response
            if 'serial-metadata-response' in data:
                journal_info = data['serial-metadata-response'].get('entry', [])
                
                if journal_info:
                    journal_title = journal_info[0].get('dc:title', 'Unknown')
                    issn = journal_info[0].get('prism:issn', 'N/A')
                    publisher_name = journal_info[0].get('dc:publisher', 'N/A')
                    links = journal_info[0].get('link', [])
                    
                    # Set status and discontinuation date if applicable
                    discontinued_date = journal_info[0].get('coverageEndYear', None)
                    if discontinued_date:
                        status_text = f"Scopus Indexed but discontinued from {discontinued_date}"
                    else:
                        status_text = "Scopus Indexed"

                    return jsonify({
                        'journal_title': journal_title,
                        'issn': issn,
                        'publisher': publisher_name,
                        'status': status_text,
                        'discontinued_date': discontinued_date,
                        'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links]
                    })
                
                # If no journal information found, it means it's not indexed
                return jsonify({
                    'journal_title': journal_name,
                    'status': "Not Scopus Indexed"
                }), 404
            
            # If no 'serial-metadata-response' found, it's not indexed
            return jsonify({
                'journal_title': journal_name,
                'status': "Not Scopus Indexed"
            }), 404

        return jsonify({'error': "Failed to fetch data from Scopus API."}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

# Endpoint to get journal suggestions based on partial title
@app.route('/api/journal/suggestions', methods=['GET'])
def get_journal_suggestions():
    partial_title = request.args.get('title')
    
    if not partial_title:
        return jsonify({'error': 'Partial title is required.'}), 400
    
    params = {'title': partial_title, 'apiKey': API_KEY}
    try:
        response = requests.get(SCOPUS_API_JOURNAL_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            if 'serial-metadata-response' in data:
                journal_info = data['serial-metadata-response'].get('entry', [])
                suggestions = []
                if journal_info:
                    for journal in journal_info:
                        suggestions.append({
                            'journal_title': journal.get('dc:title', 'Unknown'),
                            'issn': journal.get('prism:issn', 'N/A'),
                        })
                    return jsonify(suggestions)
                return jsonify([])  # Return an empty list if no suggestions found
            return jsonify({'error': "No journal metadata found."}), 404
        return jsonify({'error': "Failed to fetch data from Scopus API."}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

# Endpoint to get journal metrics (e.g., citations, SJR, SNIP)
@app.route('/api/journal/metrics', methods=['GET'])
def get_journal_metrics():
    journal_name = request.args.get('title')

    if not journal_name:
        return jsonify({'error': 'Journal title is required.'}), 400

    params = {
        'title': journal_name,
        'apiKey': API_KEY,
        'view': 'ENHANCED'  # This view may include additional metrics like SJR, SNIP
    }

    try:
        response = requests.get(SCOPUS_API_JOURNAL_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            
            # Extract metrics
            if 'serial-metadata-response' in data:
                journal_info = data['serial-metadata-response'].get('entry', [])
                if journal_info:
                    snip = journal_info[0].get('SNIP', 'N/A')
                    sjr = journal_info[0].get('SJR', 'N/A')
                    citations = journal_info[0].get('citedby-count', 'N/A')
                    
                    # Calculate credibility score
                    credibility_score = calculate_credibility(float(sjr or 0), float(snip or 0), int(citations or 0))
                    
                    return jsonify({
                        'snip': snip,
                        'sjr': sjr,
                        'citations': citations,
                        'credibility_score': credibility_score
                    })
                return jsonify({'error': "No metrics found for the journal."}), 404
            return jsonify({'error': "No journal metadata found."}), 404
        
        return jsonify({'error': "Failed to fetch data from Scopus API."}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

# Function to calculate credibility score
# Function to calculate credibility score and provide a rating
def calculate_credibility(sjr, snip, citations):
    # Calculate a weighted score
    score = (citations * 0.4) + (sjr * 0.3) + (snip * 0.3)
    rounded_score = round(score, 2)

    # Define credibility rating based on score
    if rounded_score >= 8:
        rating = "High"
    elif 5 <= rounded_score < 8:
        rating = "Medium"
    else:
        rating = "Low"

    return rounded_score, rating
# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
