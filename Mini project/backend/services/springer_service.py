import urllib.parse
import requests
from bs4 import BeautifulSoup
from utils.request_utils import make_safe_request
from utils.logger import logger

SPRINGER_BASE_URL = "https://link.springer.com"

def fetch_springer_journals(query):
    encoded_query = urllib.parse.quote(query)
    search_url = f"{SPRINGER_BASE_URL}/search?query={encoded_query}&facet-content-type=%22Journal%22"
    
    try:
        logger.info(f"Fetching Springer journals with URL: {search_url}")
        response = make_safe_request(search_url)
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        
        # Try multiple selectors for journal entries
        journal_elements = soup.select("li.has-cover") or soup.select("div.result-item") or soup.select("ol.content-item-list > li")
        
        logger.info(f"Found {len(journal_elements)} potential Springer journal results")
        
        for journal in journal_elements:
            try:
                # Extract title and link
                title_elem = journal.select_one("h2 a") or journal.select_one("h3 a") or journal.select_one("a.title")
                
                if not title_elem:
                    continue
                    
                title = title_elem.text.strip()
                link = title_elem.get('href', '#')
                if not link.startswith('http'):
                    link = SPRINGER_BASE_URL + link
                
                # Check if this is a journal
                content_type_elem = journal.select_one(".content-type") or journal.select_one(".meta-article-type")
                content_type = content_type_elem.text.strip() if content_type_elem else ""
                
                # Extract open access status
                oa_status = False
                oa_elem = journal.select_one(".open-access") or journal.select_one(".c-meta-info__item--open-access")
                if oa_elem:
                    oa_status = True
                
                # Extract subject area if available
                subject_elem = journal.select_one(".subject") or journal.select_one(".c-meta-info__subject")
                subject = subject_elem.text.strip() if subject_elem else "N/A"
                
                results.append({
                    'journal_title': title,
                    'issn': 'N/A',  # Springer doesn't easily expose ISSN on search results
                    'publisher': 'Springer',
                    'subjects': subject,
                    'impact_factor': "Not Available",
                    'status': "Springer Indexed",
                    'open_access': oa_status,
                    'source': "Springer",
                    'redirect_links': [{"title": "Springer", "href": link}]
                })
            except Exception as e:
                logger.error(f"Error parsing a Springer journal entry: {e}")
                continue
        
        logger.info(f"Successfully parsed {len(results)} Springer journals")
        return results
    except Exception as e:
        logger.error(f"Error in Springer journals function: {e}")
        return []