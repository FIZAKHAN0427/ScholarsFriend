from flask import Flask, jsonify, request, render_template, redirect
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


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
cache = TTLCache(maxsize=100, ttl=600)
logging.basicConfig(level=logging.INFO)

# API Keys
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')

# API Endpoints
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"
OPENALEX_API = "https://api.openalex.org/works"

def fetch_with_backoff(url, params=None, headers=None, retries=3):
    """Make HTTP requests with exponential backoff"""
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params, headers=headers)
            if response.status_code == 200:
                return response
            time.sleep(2 ** attempt)
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error: {e}")
    return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/journal/suggestions', methods=['GET'])
def get_journal_suggestions():
    """Get journal title suggestions using TF-IDF similarity"""
    partial_title = request.args.get('title')
    if not partial_title:
        return jsonify({'error': 'Partial title is required.'}), 400
    
    params = {'title': partial_title, 'apiKey': API_KEY}
    response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
    
    if response:
        data = response.json()
        if 'serial-metadata-response' in data:
            journal_info = data['serial-metadata-response'].get('entry', [])
            journal_titles = [j.get('dc:title', '') for j in journal_info]
            
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(journal_titles)
            query_vector = vectorizer.transform([partial_title])
            
            cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
            top_indices = cosine_similarities.argsort()[-5:][::-1]
            
            suggestions = [{
                'journal_title': journal_titles[i],
                'issn': journal_info[i].get('prism:issn', 'N/A')
            } for i in top_indices]
            
            return jsonify(suggestions)
    return jsonify({'error': "Failed to fetch suggestions."}), 500

@app.route('/api/journal/metrics', methods=['GET'])
def get_journal_metrics():
    """Get metrics for a specific journal by ISSN"""
    issn = request.args.get('issn')
    journal_name = request.args.get('title')
    if not issn and not journal_name:
        return jsonify({'error': 'Either ISSN or journal name is required.'}), 400
    if issn:
        url = f"https://api.elsevier.com/content/serial/title/issn/{issn}"
    else:
        url = f"https://api.elsevier.com/content/serial/title?title={journal_name}"
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
    if request.args.get('subjectArea'):
        # Map subject area to Scopus subject area codes
        subject_mapping = {
            'Computer Science': 'COMP',
            'Engineering': 'ENGI',
            'Medicine': 'MEDI',
            'Physics': 'PHYS',
            'Chemistry': 'CHEM',
            'Biology': 'BIOC',
            'Mathematics': 'MATH',
            'Social Sciences': 'SOCI',
            'Arts and Humanities': 'ARTS',
            'Business': 'BUSI',
            'Economics': 'ECON',
            'Psychology': 'PSYC',
            'Environmental Science': 'ENVI',
            'Earth and Planetary Sciences': 'EART'
        }
        subject_code = subject_mapping.get(request.args.get('subjectArea'))
        if subject_code:
            params['subj'] = subject_code
    
    if request.args.get('indexing'):
        indexing = request.args.get('indexing')
        params['content'] = 'core' if indexing == 'scopus' else 'sci'
    
    if request.args.get('citeScoreMin') or request.args.get('citeScoreMax'):
        min_score = request.args.get('citeScoreMin', '0')
        max_score = request.args.get('citeScoreMax', '999')
        params['citeScoreYearInfoList.citeScoreCurrentMetric'] = f"{min_score}-{max_score}"
    
    if request.args.get('openAccess'):
        oa_value = request.args.get('openAccess')
        params['oa'] = 'full' if oa_value == '1' else 'partial' if oa_value == '2' else 'none'
    
    if request.args.get('publisher'):
        params['pub'] = request.args.get('publisher')
    
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

            # Filter journals based on CiteScore range
            cite_score_min = request.args.get('citeScoreMin')
            cite_score_max = request.args.get('citeScoreMax')
            if cite_score_min or cite_score_max:
                def in_cite_score_range(journal):
                    try:
                        score = float(journal.get('citeScoreYearInfoList', {}).get('citeScoreCurrentMetric', 'nan'))
                    except Exception:
                        return False
                    if cite_score_min and score < float(cite_score_min):
                        return False
                    if cite_score_max and score > float(cite_score_max):
                        return False
                    return not (score != score)  # Exclude NaN
                journal_info = [j for j in journal_info if in_cite_score_range(j)]

            if journal_info:
                results = []
                for journal in journal_info:
                    # Find a link to the journal (prefer Scopus or first available)
                    links = journal.get('link', [])
                    journal_url = None
                    for link in links:
                        if link.get('title', '').lower() == 'scopus' or link.get('@ref', '').lower() == 'scopus':
                            journal_url = link.get('@href')
                            break
                    if not journal_url and links:
                        journal_url = links[0].get('@href')

                    # Get subject areas
                    subject_areas = []
                    if journal.get('subject-area'):
                        for area in journal.get('subject-area', []):
                            if isinstance(area, dict) and area.get('$'):
                                subject_areas.append(area.get('$'))

                    result = {
                        'journal_title': journal.get('dc:title', 'Unknown'),
                        'issn': journal.get('prism:issn', 'N/A'),
                        'eissn': journal.get('prism:eissn', 'N/A'),
                        'publisher': journal.get('dc:publisher', 'N/A'),
                        'status': "Scopus Indexed",
                        'subject_areas': subject_areas,
                        'cite_score': journal.get('citeScoreYearInfoList', {}).get('citeScoreCurrentMetric', 'N/A'),
                        'quartile': journal.get('citeScoreYearInfoList', {}).get('citeScoreSubjectRank', {}).get('quartile', 'N/A'),
                        'open_access': journal.get('openaccess', 'N/A'),
                        'links': [{"title": link.get('@ref'), "href": link.get('@href')} for link in links],
                        'journal_url': journal_url
                    }
                    results.append(result)

                # Cache the results
                cache[cache_key] = results
                return jsonify(results)
            
        return jsonify([])
    
    return jsonify({'error': 'Failed to fetch data from Scopus API'}), 500

@app.route('/api/check-article', methods=['POST'])
def check_article():
    try:
        # Extract the article name from the request body
        data = request.json
        keywords = data.get('name', '').strip()

        # Validate the input
        if not keywords:
            return jsonify({"error": "Keywords are required"}), 400

        # First check Scopus database
        params = {'title': keywords, 'apiKey': API_KEY}
        scopus_response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
        
        if scopus_response and scopus_response.status_code == 200:
            data = scopus_response.json()
            if 'serial-metadata-response' in data and data['serial-metadata-response'].get('entry'):
                journal_info = data['serial-metadata-response'].get('entry', [])[0]
                return jsonify({
                    "exists": True,
                    "details": {
                        "name": journal_info.get('dc:title', 'No title available'),
                        "issn": journal_info.get('prism:issn', 'N/A'),
                        "publisher": journal_info.get('dc:publisher', 'N/A')
                    }
                })

        # If not found in Scopus, check OpenAlex
        params = {"search": keywords}
        openalex_response = requests.get(OPENALEX_API, params=params)
        
        if openalex_response.status_code == 200:
            results = openalex_response.json().get("results", [])
            if results:
                best_match = max(results, key=lambda x: fuzz.ratio(keywords.lower(), x.get('display_name', '').lower()))
                if fuzz.ratio(keywords.lower(), best_match.get('display_name', '').lower()) >= 70:
                    # Reconstruct the abstract from the inverted index
                    abstract = reconstruct_abstract(best_match.get('abstract_inverted_index'))
                    return jsonify({
                        "exists": True,
                        "details": {
                            "name": best_match.get('display_name', 'No title available'),
                            "abstract": abstract
                        }
                    })

        # If not found, use Groq API for suggestions
        try:
            groq_headers = {
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json'
            }
            groq_payload = {
                "model": "llama3-8b-8192",  # Specify the model (adjust based on Groq's available models)
                "messages": [
                    {"role": "user", "content": f"Provide suggestions for an article titled '{keywords}' not found in academic databases"}
                ],
                "max_tokens": 500
            }
            groq_response = requests.post(GROQ_API_URL, json=groq_payload, headers=groq_headers)
            
            if groq_response.status_code == 200:
                suggestions = groq_response.json()['choices'][0]['message']['content']
                return jsonify({
                    "exists": False,
                    "suggestions": suggestions
                })
            else:
                logging.error(f"Groq API error: {groq_response.status_code} - {groq_response.text}")
                return jsonify({
                    "exists": False,
                    "suggestions": f"Unable to fetch suggestions due to Groq API error: {groq_response.text}"
                })
        except requests.exceptions.RequestException as e:
            logging.error(f"Groq API request failed: {str(e)}")
            return jsonify({
                "exists": False,
                "suggestions": "Unable to fetch suggestions due to network error"
            })

    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf():
    """Summarize PDF content using Groq API"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "PDF file required"}), 400

        # Extract text from PDF
        reader = PdfReader(file)
        text = "".join(page.extract_text() for page in reader.pages)
        if not text.strip():
            return jsonify({"error": "No text found in PDF"}), 400

        # Call Groq API
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "max_length": 130,
            "min_length": 30
        }

        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            return jsonify({"summary": response.json().get("summary", "")})
        return jsonify({
            "error": "Groq API failed",
            "details": response.text
        }), 500

    except Exception as e:
        logging.error(f"PDF summarization error: {str(e)}")
        return jsonify({"error": str(e)}), 500

try:
    from groq import Groq
    client = Groq(api_key="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")  # Replace with your actual API key
    groq_available = True
except ImportError:
    groq_available = False
    print("Groq library not available - running in fallback mode")
except Exception as e:
    groq_available = False
    print(f"Error initializing Groq client: {e}")

# Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or "your_groq_api_key_here"
MODEL_NAME = "mixtral-8x7b-32768"

# Initialize Groq client with better error handling
try:
    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)
    groq_available = True
    print("Groq client initialized successfully")
except Exception as e:
    groq_available = False
    print(f"Failed to initialize Groq client: {str(e)}")

# Expert prompt (unchanged from your original)
expert_prompt = """
You are an expert in bibliometric analysis and Scopus database with the following capabilities:

1. Deep knowledge of bibliometric indicators:
   - h-index, g-index, m-index
   - Citation counts and normalized metrics (FWCI)
   - Journal metrics: CiteScore, SJR, SNIP
   - Collaboration metrics and co-authorship patterns

2. Scopus database expertise:
   - Advanced search query construction
   - Affiliation identification and disambiguation
   - Author profile analysis
   - Document search strategies

3. Research evaluation:
   - Comparative analysis of research outputs
   - Trend analysis in scientific publications
   - Research impact assessment
   - Identification of emerging topics

4. Practical guidance:
   - How to use Scopus effectively
   - Interpreting bibliometric data
   - Limitations and proper use of metrics
   - Ethical considerations in research evaluation

Provide detailed, accurate responses with clear explanations. When appropriate:
- Suggest specific Scopus search queries
- Recommend analysis methodologies
- Explain complex concepts in accessible terms
- Offer multiple perspectives on bibliometric questions
"""

def get_response(msg):
    """Enhanced with better error handling and debugging"""
    if not groq_available:
        return "The expert service is currently unavailable. Please try again later."
    
    if not msg or not isinstance(msg, str):
        return "Please provide a valid message."

    try:
        print(f"Processing message: {msg}")  # Debug logging
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": expert_prompt},
                {"role": "user", "content": msg}
            ],
            model=MODEL_NAME,
            temperature=0.3,
            max_tokens=1024
        )
        
        if response and response.choices:
            return response.choices[0].message.content
        return "Received an empty response from the service."
        
    except Exception as e:
        print(f"API Error Details: {str(e)}")  # Detailed error logging
        return "I'm having trouble connecting to the expert system. Please try again in a moment."

@app.route('/predict', methods=['POST'])
def predict():
    """Enhanced endpoint with better validation"""
    if not request.is_json:
        return jsonify({'answer': 'Request must be JSON'}), 400
        
    data = request.get_json()
    text = data.get('message', '').strip()
    
    if not text:
        return jsonify({'answer': 'Message cannot be empty'}), 400
    
    response = get_response(text)
    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)