import requests
import time
import logging
from pymongo import MongoClient
from datetime import datetime
import concurrent.futures
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')  # Adjust as needed
db = client['journal_database']
journals_collection = db['journals']
articles_collection = db['articles']

# API endpoints and key
API_KEY = os.getenv('SCOPUS_API_KEY', 'ecd7925a3f6b0d8db8f401b0afabe1b4')  # Use environment variable in production
SCOPUS_API_JOURNAL_URL = "https://api.elsevier.com/content/serial/title"
OPENALEX_API = "https://api.openalex.org/works"

def fetch_with_backoff(url, params=None, headers=None, retries=5):
    """Make requests with exponential backoff for reliability"""
    for attempt in range(retries):
        try:
            if headers:
                response = requests.get(url, params=params, headers=headers)
            else:
                response = requests.get(url, params=params)
                
            if response.status_code == 200:
                return response
            elif response.status_code == 429:  # Rate limit exceeded
                wait_time = 2 ** attempt + 1
                logger.warning(f"Rate limit hit. Waiting {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                logger.warning(f"Request failed with status {response.status_code}. Retrying...")
                time.sleep(2 ** attempt)  # Exponential backoff
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {e}")
            time.sleep(2 ** attempt)
    return None

def store_journal_data(journal_data):
    """Store journal data in MongoDB"""
    # Add timestamp for data freshness tracking
    journal_data['last_updated'] = datetime.now()
    
    # Upsert: update if exists, insert if not
    query = {'issn': journal_data.get('issn')} if journal_data.get('issn') else {'journal_title': journal_data.get('journal_title')}
    journals_collection.update_one(query, {'$set': journal_data}, upsert=True)
    
    # Log the operation
    logger.info(f"Stored/updated journal: {journal_data.get('journal_title')}")
    return journal_data

def store_article_data(article_data):
    """Store article data in MongoDB"""
    # Add timestamp
    article_data['last_updated'] = datetime.now()
    
    # Generate a query to find duplicate articles
    title = article_data.get('name', '')
    query = {'name': title}
    
    # Upsert operation
    articles_collection.update_one(query, {'$set': article_data}, upsert=True)
    
    # Log the operation
    logger.info(f"Stored/updated article: {title}")
    return article_data

def fetch_all_journals(start_index=0, batch_size=200, max_records=10000):
    """
    Fetch all available journals from Scopus API using pagination
    
    Args:
        start_index: Starting index for pagination
        batch_size: Number of records per request
        max_records: Maximum number of records to fetch
    """
    total_fetched = 0
    current_index = start_index
    
    while total_fetched < max_records:
        logger.info(f"Fetching journals batch starting at index {current_index}")
        
        # Use a wildcard search to get all journals
        params = {
            'start': current_index,
            'count': batch_size,
            'apiKey': API_KEY,
            # Use a very broad search to get as many journals as possible
            'title': '*' 
        }
        
        response = fetch_with_backoff(SCOPUS_API_JOURNAL_URL, params)
        
        if not response or response.status_code != 200:
            logger.error(f"Failed to fetch journals batch at index {current_index}")
            break
            
        data = response.json()
        
        # Check if we have journal data
        if 'serial-metadata-response' in data:
            journal_info = data['serial-metadata-response'].get('entry', [])
            
            if not journal_info:
                logger.info("No more journals to fetch")
                break
                
            batch_count = len(journal_info)
            logger.info(f"Fetched {batch_count} journals")
            
            # Process and store each journal
            for journal in journal_info:
                # Extract journal data
                journal_title = journal.get('dc:title', 'Unknown')
                issn = journal.get('prism:issn', 'N/A')
                publisher_name = journal.get('dc:publisher', 'N/A')
                links = journal.get('link', [])
                
                discontinued_date = journal.get('coverageEndYear', None)
                status_text = f"Scopus Indexed but discontinued from {discontinued_date}" if discontinued_date else "Scopus Indexed"
                
                # Create journal record
                journal_data = {
                    'journal_title': journal_title,
                    'issn': issn,
                    'publisher': publisher_name,
                    'status': status_text,
                    'discontinued_date': discontinued_date,
                    'redirect_links': [{"title": link.get('title'), "href": link.get('@href')} for link in links if link],
                    'source': 'Scopus API'
                }
                
                # Store in MongoDB
                store_journal_data(journal_data)
            
            total_fetched += batch_count
            current_index += batch_count
            
            # Check if we've reached the end of available data
            if batch_count < batch_size:
                logger.info("Reached end of journal data")
                break
                
            # Add a delay to avoid hitting rate limits
            time.sleep(2)
        else:
            logger.error("Unexpected API response format")
            break
    
    logger.info(f"Completed journal fetch. Total journals fetched: {total_fetched}")
    return total_fetched

def fetch_all_articles(start_date="2020-01-01", end_date="2024-12-31", batch_size=100, max_pages=50):
    """
    Fetch all available articles from OpenAlex API using pagination and date filtering
    
    Args:
        start_date: Start date for article search
        end_date: End date for article search  
        batch_size: Number of records per request
        max_pages: Maximum number of pages to fetch per date range
    """
    total_fetched = 0
    
    # Break down by years to make manageable chunks
    years = range(int(start_date.split('-')[0]), int(end_date.split('-')[0]) + 1)
    
    for year in years:
        year_start = f"{year}-01-01"
        year_end = f"{year}-12-31"
        
        logger.info(f"Fetching articles for year {year}")
        
        # Set up initial parameters
        params = {
            "filter": f"publication_date:{year_start}:{year_end}",
            "per-page": batch_size,
            "page": 1
        }
        
        # Fetch pages until we reach the limit or run out of data
        for page in range(1, max_pages + 1):
            logger.info(f"Fetching articles for year {year}, page {page}")
            params["page"] = page
            
            response = fetch_with_backoff(OPENALEX_API, params)
            
            if not response or response.status_code != 200:
                logger.error(f"Failed to fetch articles for year {year}, page {page}")
                break
                
            data = response.json()
            results = data.get("results", [])
            
            if not results:
                logger.info(f"No more articles for year {year}")
                break
                
            batch_count = len(results)
            logger.info(f"Fetched {batch_count} articles for year {year}, page {page}")
            
            # Process and store each article
            for result in results:
                # Extract article data
                article_data = {
                    "name": result.get('display_name', 'No title available'),
                    "doi": result.get('doi', 'N/A'),
                    "publication_date": result.get('publication_date', 'N/A'),
                    "journal": result.get('primary_location', {}).get('source', {}).get('display_name', 'N/A'),
                    "journal_issn": result.get('primary_location', {}).get('source', {}).get('issn_l', 'N/A'),
                    "authors": [author.get('author', {}).get('display_name', 'Unknown') 
                               for author in result.get('authorships', []) if 'author' in author],
                    "details": result.get('abstract_inverted_index', {}),
                    "source": "OpenAlex API",
                }
                
                # Store in MongoDB
                store_article_data(article_data)
            
            total_fetched += batch_count
            
            # Add a delay to avoid hitting rate limits
            time.sleep(1)
            
            # Check if we've reached the end of available data
            if batch_count < batch_size:
                logger.info(f"Reached end of article data for year {year}")
                break
    
    logger.info(f"Completed article fetch. Total articles fetched: {total_fetched}")
    return total_fetched

def update_journal_metrics(limit=1000):
    """
    Update metrics for journals in the database that have valid ISSNs
    
    Args:
        limit: Maximum number of journals to update
    """
    updated_count = 0
    
    # Find journals with valid ISSNs
    issns = list(journals_collection.distinct('issn', {'issn': {'$ne': 'N/A'}}))
    logger.info(f"Found {len(issns)} journals with valid ISSNs")
    
    # Limit the number of journals to update
    issns = issns[:limit]
    
    # Update metrics for each journal
    for i, issn in enumerate(issns):
        logger.info(f"Updating metrics for journal {i+1}/{len(issns)} with ISSN: {issn}")
        
        url = f"https://api.elsevier.com/content/serial/title/issn/{issn}"
        headers = {'Accept': 'application/json', 'X-ELS-APIKey': API_KEY}
        
        response = fetch_with_backoff(url, headers=headers, retries=3)
        
        if response and response.status_code == 200:
            data = response.json()
            
            # Find the journal in our collection
            journal = journals_collection.find_one({'issn': issn})
            
            if journal:
                # Update with metrics data
                journals_collection.update_one(
                    {'issn': issn}, 
                    {'$set': {
                        'metrics': data,
                        'last_updated': datetime.now()
                    }}
                )
                updated_count += 1
                logger.info(f"Updated metrics for journal with ISSN: {issn}")
            else:
                # Create new journal entry with metrics
                journal_data = {
                    'issn': issn,
                    'metrics': data,
                    'source': 'Scopus API',
                    'last_updated': datetime.now()
                }
                journals_collection.insert_one(journal_data)
                updated_count += 1
                logger.info(f"Created new journal with metrics for ISSN: {issn}")
        else:
            logger.warning(f"Failed to fetch metrics for journal ISSN: {issn}")
        
        # Add a delay to avoid hitting rate limits
        time.sleep(1)
    
    logger.info(f"Completed metrics update. Total journals updated: {updated_count}")
    return updated_count

def main():
    logger.info("Starting comprehensive data sync process")
    
    results = {
        'journals_fetched': 0,
        'articles_fetched': 0,
        'metrics_updated': 0
    }
    
    # 1. Fetch all journals
    logger.info("Starting comprehensive journal fetch")
    journals_count = fetch_all_journals(max_records=5000)  # Limit to 5000 journals
    results['journals_fetched'] = journals_count
    
    # 2. Fetch articles by year range
    logger.info("Starting comprehensive article fetch")
    articles_count = fetch_all_articles(
        start_date="2023-01-01",  # Last two years only - adjust as needed
        end_date="2024-12-31", 
        max_pages=10  # Limit to 10 pages per year
    )
    results['articles_fetched'] = articles_count
    
    # 3. Update metrics for journals
    logger.info("Starting journal metrics update")
    metrics_count = update_journal_metrics(limit=500)  # Limit to 500 journals
    results['metrics_updated'] = metrics_count
    
    # Print results
    logger.info("Data sync process completed")
    logger.info(f"Journals fetched: {results['journals_fetched']}")
    logger.info(f"Articles fetched: {results['articles_fetched']}")
    logger.info(f"Journal metrics updated: {results['metrics_updated']}")
    
    return results

if __name__ == "__main__":
    main()