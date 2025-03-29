import urllib.parse
import requests
from bs4 import BeautifulSoup
from utils.request_utils import make_safe_request
from utils.logger import logger

DOAJ_BASE_URL = "https://doaj.org"

def fetch_doaj_journals(query):
    encoded_query = urllib.parse.quote(query)
    search_url = f"{DOAJ_BASE_URL}/search/journals?source=%7B%22query%22%3A%7B%22query_string%22%3A%7B%22query%22%3A%22{encoded_query}%22%2C%22default_field%22%3A%22bibjson.title%22%7D%7D%7D"
    
    try:
        logger.info(f"Fetching DOAJ journals with URL: {search_url}")
        response = make_safe_request(search_url)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        
        # Find all journal results - try multiple possible selectors
        journal_elements = soup.select("div.journal-result") or soup.select("div.search-results__record")
        
        logger.info(f"Found {len(journal_elements)} potential DOAJ journal results")
        
        for journal in journal_elements:
            try:
                # Extract title and link
                title_elem = journal.select_one("h3 a") or journal.select_one("h2 a") or journal.select_one("a.title")
                
                if not title_elem:
                    continue
                    
                title = title_elem.text.strip()
                link = title_elem.get('href', '#')
                if not link.startswith('http'):
                    link = DOAJ_BASE_URL + link
                
                # Extract ISSN if available
                issn_elem = journal.select_one(".issn") or journal.select_one("[data-id='issn']")
                issn = issn_elem.text.strip() if issn_elem else "N/A"
                
                # Extract publisher if available
                publisher_elem = journal.select_one(".publisher") or journal.select_one("[data-id='publisher']")
                publisher = publisher_elem.text.strip() if publisher_elem else "N/A"
                
                # Extract subject areas if available
                subjects_elem = journal.select_one(".subjects") or journal.select_one("[data-id='subjects']")
                subjects = subjects_elem.text.strip() if subjects_elem else "N/A"
                
                results.append({
                    'journal_title': title,
                    'issn': issn,
                    'publisher': publisher,
                    'subjects': subjects,
                    'impact_factor': "Not Available",
                    'status': "DOAJ Indexed",
                    'open_access': True,
                    'source': "DOAJ",
                    'redirect_links': [{"title": "DOAJ", "href": link}]
                })
            except Exception as e:
                logger.error(f"Error parsing a DOAJ journal entry: {e}")
                continue
        
        logger.info(f"Successfully parsed {len(results)} DOAJ journals")
        return results
    except Exception as e:
        logger.error(f"Error in DOAJ journals function: {e}")
        return []