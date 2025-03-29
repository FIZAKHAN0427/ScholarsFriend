import urllib.parse
import requests
from bs4 import BeautifulSoup
from utils.request_utils import make_safe_request
from utils.logger import logger
import os

PUBMED_BASE_URL = "https://pubmed.ncbi.nlm.nih.gov"
PUBMED_API_KEY = os.getenv('PUBMED_API_KEY')

def fetch_pubmed_journals(query):
    results = []
    encoded_query = urllib.parse.quote(query)
    
    if PUBMED_API_KEY:
        # Use API if key is available
        search_url = f"{PUBMED_BASE_URL}/api/search"
        headers = HEADERS.copy()
        headers['api-key'] = PUBMED_API_KEY
        
        try:
            logger.info(f"Fetching PubMed journals via API for query: {query}")
            params = {
                'term': f"{query}[journal]",
                'retmax': 20,
                'sort': 'relevance'
            }
            response = make_safe_request(search_url, headers=headers, params=params)
            data = response.json()
            
            journal_ids = data.get('esearchresult', {}).get('idlist', [])
            
            # Fetch details for each journal
            for journal_id in journal_ids:
                try:
                    detail_url = f"{PUBMED_BASE_URL}/api/summary/{journal_id}"
                    detail_response = make_safe_request(detail_url, headers=headers)
                    journal_data = detail_response.json()
                    
                    summary = journal_data.get('result', {}).get(journal_id, {})
                    title = summary.get('title', 'Unknown')
                    
                    results.append({
                        'journal_title': title,
                        'issn': summary.get('issn', 'N/A'),
                        'publisher': summary.get('publishername', 'N/A'),
                        'subjects': summary.get('pubtype', ['Medical'])[0],
                        'impact_factor': "Not Available",
                        'status': "PubMed Indexed",
                        'open_access': summary.get('fulljournalname', '').lower().find('open') > -1,
                        'source': "PubMed",
                        'redirect_links': [{"title": "PubMed", "href": f"{PUBMED_BASE_URL}/{journal_id}"}]
                    })
                except Exception as e:
                    logger.error(f"Error processing PubMed journal ID {journal_id}: {e}")
            
        except Exception as e:
            logger.error(f"Error using PubMed API: {e}")
    else:
        # Fallback to web scraping
        search_url = f"{PUBMED_BASE_URL}/?term={encoded_query}+%5Bjournal%5D"
        
        try:
            logger.info(f"Fetching PubMed journals with URL: {search_url}")
            response = make_safe_request(search_url)
            
            soup = BeautifulSoup(response.text, 'html.parser')
            journal_elements = soup.select("article.full-docsum") or soup.select(".docsum-content")
            
            logger.info(f"Found {len(journal_elements)} potential PubMed journal results")
            
            for journal in journal_elements:
                try:
                    # Extract title and link
                    title_elem = journal.select_one("a.docsum-title") or journal.select_one(".title")
                    title = title_elem.text.strip() if title_elem else "Unknown"
                    link = title_elem.get('href', '#') if title_elem else "#"
                    if not link.startswith('http'):
                        link = PUBMED_BASE_URL + link
                    
                    # Extract additional details if available
                    details_elem = journal.select_one(".docsum-authors") or journal.select_one(".authors")
                    details = details_elem.text.strip() if details_elem else "N/A"
                    
                    results.append({
                        'journal_title': title,
                        'issn': 'N/A',  # ISSN not available in search results
                        'publisher': 'N/A',
                        'subjects': "Medical",
                        'impact_factor': "Not Available",
                        'status': "PubMed Indexed",
                        'open_access': False,  # Default, can be refined
                        'source': "PubMed",
                        'redirect_links': [{"title": "PubMed", "href": link}]
                    })
                except Exception as e:
                    logger.error(f"Error parsing a PubMed journal entry: {e}")
                    continue
        
        except Exception as e:
            logger.error(f"Error in PubMed journals function: {e}")
    
    logger.info(f"Successfully parsed {len(results)} PubMed journals")
    return results