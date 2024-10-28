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
    
    params = {'title': journal_name, 'apiKey': API_KEY, 'view': 'ENHANCED'}
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
                    coverage_start_year = journal_info[0].get('coverageStartYear', 'N/A')
                    coverage_end_year = journal_info[0].get('coverageEndYear', 'N/A')
                    links = journal_info[0].get('link', [])
                    
                    # Determine status, coverage years, and discontinuation date
                    status_text = "Scopus Indexed"
                    coverage_years = f"from {coverage_start_year} to {coverage_end_year}" if coverage_start_year and coverage_end_year else "N/A"
                    discontinued_date = coverage_end_year if coverage_end_year and coverage_end_year != "N/A" and int(coverage_end_year) < 2024 else None
                    
                    # Update status if discontinued
                    if discontinued_date:
                        status_text = "Not Scopus Indexed"
                        coverage_years += " (coverage discontinued in Scopus)"

                    # Prepare the response
                    response_data = {
                        'journal_title': journal_title,
                        'issn': issn,
                        'publisher': publisher_name,
                        'status': status_text,
                        'coverage_years': coverage_years,
                        'discontinued_date': discontinued_date,  # Ensure this is included
                        'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links]
                    }
                    print(response_data)  # Debugging line to check the response data
                    
                    return jsonify(response_data)
                
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

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
