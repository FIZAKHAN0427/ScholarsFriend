import requests
import os
from pymongo import MongoClient
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load API Key from environment variable
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')  # Replace with your actual default API key

# Scopus Journal search API endpoint
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')  # Update with your MongoDB URI
db = client['scholarsfriend_journal_db']  # Database name
collection = db['journals']  # Collection name

# File to store the last fetched start index
LAST_FETCHED_INDEX_FILE = "last_fetched_index.txt"

# Function to make requests with exponential backoff for reliability
def fetch_with_backoff(url, params, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response
            elif response.status_code == 429:  # Rate limit exceeded
                retry_after = int(response.headers.get('Retry-After', 10))  # Default to 10 seconds
                logging.warning(f"Rate limit exceeded. Retrying after {retry_after} seconds.")
                time.sleep(retry_after)
            else:
                logging.error(f"Request failed with status code: {response.status_code}")
                return None
            time.sleep(2 ** attempt)  # Exponential backoff
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error: {e}")
    return None

# Function to fetch all journals and store in MongoDB
def fetch_and_store_journals():
    params = {'apiKey': API_KEY, 'count': 5000}  # Fetch 100 records per request (max allowed by API)
    start = 990  # Start index for pagination
    total_inserted = 10000  # Track total inserted records

    # Load last fetched start index from file (if exists)
    if os.path.exists(LAST_FETCHED_INDEX_FILE):
        with open(LAST_FETCHED_INDEX_FILE, 'r') as f:
            start = int(f.read())
        logging.info(f"Resuming from start index: {start}")

    while True:
        params['start'] = start  # Update start index for pagination
        response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)

        if response:
            data = response.json()
            if 'serial-metadata-response' in data:
                journal_info = data['serial-metadata-response'].get('entry', [])
                if not journal_info:  # No more records to fetch
                    break

                for journal in journal_info:
                    journal_title = journal.get('dc:title', 'Unknown')
                    issn = journal.get('prism:issn', 'N/A')
                    publisher_name = journal.get('dc:publisher', 'N/A')
                    discontinued_date = journal.get('coverageEndYear', None)
                    status_text = f"Scopus Indexed but discontinued from {discontinued_date}" if discontinued_date else "Scopus Indexed"
                    links = journal.get('link', [])  # Extract links

                    journal_data = {
                        'journal_title': journal_title,
                        'issn': issn,
                        'publisher': publisher_name,
                        'status': status_text,
                        'discontinued_date': discontinued_date,
                        'links': [{"title": link.get('@title', 'No title'), "href": link.get('@href', 'No URL')} for link in links]  # Store links
                    }

                    # Insert into MongoDB
                    collection.insert_one(journal_data)
                    logging.info(f"Inserted journal: {journal_title}")
                    total_inserted += 1

                # Save the current start index to file
                with open(LAST_FETCHED_INDEX_FILE, 'w') as f:
                    f.write(str(start))

                # Check if there are more pages
                links = data['serial-metadata-response'].get('link', [])
                next_link = next((link['@href'] for link in links if link.get('@ref') == 'next'), None)

                if not next_link:  # No more pages
                    break

                start += len(journal_info)  # Update start index for next page
                logging.info(f"Fetched {len(journal_info)} records. Total inserted so far: {total_inserted}")

                # Add a delay to avoid hitting rate limits
                time.sleep(5)  # Adjust delay as needed
            else:
                logging.error("No journal data found in the API response.")
                break
        else:
            logging.error("Failed to fetch data from Scopus API.")
            break

    logging.info(f"Journals fetched and stored successfully. Total inserted: {total_inserted}")

if __name__ == '__main__':
    fetch_and_store_journals()