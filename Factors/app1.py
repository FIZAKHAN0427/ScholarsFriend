from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

API_KEY = 'ecd7925a3f6b0d8db8f401b0afabe1b4'  # Replace with your actual API key

@app.route('/')
def home():
    return render_template('index.html')

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

if __name__ == '__main__':
    app.run(debug=True,port=5002)
