from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests
import os
from chat import get_response

app = Flask(__name__)
CORS(app)

# Welcome message for the home route
@app.route('/')
def home():
    return render_template('index.html')

# Load API Key from environment variable
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')  # Replace with your actual default API key

# Scopus Journal search API endpoint
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"

# Endpoint to search for journal status
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
    

###################################################################################################################################3333333333333    


# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# @app.route('/', methods=['GET'])
# def index_get():
#     return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get('message')
    if not text:  # Check if text is valid
        return jsonify({'answer': 'Please provide a message.'}), 400

    response = get_response(text)
    message = {'answer': response}
    return jsonify(message)


# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
