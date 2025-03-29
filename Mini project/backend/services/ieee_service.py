import urllib.parse
import requests
import re
from bs4 import BeautifulSoup
from utils.request_utils import make_safe_request
from utils.logger import logger

# Ensure HEADERS is defined at the top of the file
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}
IEEE_BASE_URL = "ieeexplore.ieee.org"

def fetch_ieee_publications(query, publication_type=None):
    """
    Fetch IEEE publications based on search query and optional publication type filter
    """
    encoded_query = urllib.parse.quote(query)
    
    # Build the search URL based on publication type
    if publication_type == 'journals':
        search_url = f"{IEEE_BASE_URL}/search/searchresult.jsp?newsearch=true&queryText={encoded_query}&type=journals"
    elif publication_type == 'conferences':
        search_url = f"{IEEE_BASE_URL}/search/searchresult.jsp?newsearch=true&queryText={encoded_query}&type=conferences"
    else:  # Default to all publications
        search_url = f"{IEEE_BASE_URL}/search/searchresult.jsp?newsearch=true&queryText={encoded_query}"
    
    try:
        logger.info(f"Fetching IEEE publications with URL: {search_url}")
        response = make_safe_request(search_url, headers=HEADERS)  # Pass headers here
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Debug: Log the HTML content
        logger.debug(f"HTML content: {soup.prettify()}")
        
        results = []
        result_items = soup.select("xpl-results-item div")  # Update selector
        
        logger.info(f"Found {len(result_items)} potential IEEE publication results")
        
        for item in result_items:
            try:
                # Extract title and link
                title_elem = item.select_one("h3.text-md-md-lh a.fw-bold")
                title = title_elem.text.strip() if title_elem else "Unknown"
                link = title_elem.get('href', '#') if title_elem else "#"
                if not link.startswith('http'):
                    link = IEEE_BASE_URL + link
                
                # Extract authors
                authors = []
                authors_container = item.select_one("xpl-authors-name-list")
                if authors_container:
                    author_links = authors_container.select("a")
                    for author_link in author_links:
                        author_name = author_link.text.strip()
                        if author_name:
                            authors.append(author_name)
                
                # Extract publication type
                pub_type = "Unknown"
                content_type_elem = item.select_one("span.publisher-info-container span[xplhighlight]")
                if content_type_elem:
                    pub_type = content_type_elem.text.strip()
                
                # Extract conference/journal name
                pub_name = ""
                pub_name_elem = item.select_one("div.description.text-base-md-lh a")
                if pub_name_elem:
                    pub_name = pub_name_elem.text.strip()
                
                # Extract year
                year = ""
                year_elem = item.select_one("span.publisher-info-container span[xplhighlight]")
                if year_elem:
                    year_match = re.search(r'Year:\s*(\d{4})', year_elem.text)
                    if year_match:
                        year = year_match.group(1)
                
                # Extract citation count
                citations = "0"
                citations_elem = item.select_one("div.description.text-base-md-lh div a:-soup-contains('Papers (')")
                if citations_elem:
                    citations_match = re.search(r'Papers\s*\((\d+)\)', citations_elem.text)
                    if citations_match:
                        citations = citations_match.group(1)
                
                # Extract patent citations
                patent_citations = "0"
                patent_elem = item.select_one("div.description.text-base-md-lh div a:-soup-contains('Patents (')")
                if patent_elem:
                    patent_match = re.search(r'Patents\s*\((\d+)\)', patent_elem.text)
                    if patent_match:
                        patent_citations = patent_match.group(1)
                
                # Extract publisher
                publisher = "IEEE"
                publisher_elem = item.select_one("xpl-publisher span.text-base-md-lh span")
                if publisher_elem:
                    publisher = publisher_elem.text.strip()
                
                # Create result dictionary
                publication_data = {
                    'title': title,
                    'authors': authors,
                    'publication_type': pub_type,
                    'publication_name': pub_name,
                    'year': year,
                    'citations': citations,
                    'patent_citations': patent_citations,
                    'publisher': publisher,
                    'link': link,
                    'source': "IEEE Xplore"
                }
                
                results.append(publication_data)
                
            except Exception as e:
                logger.error(f"Error parsing an IEEE publication entry: {e}")
                continue
        
        logger.info(f"Successfully parsed {len(results)} IEEE publications")
        return results
    except Exception as e:
        logger.error(f"Error in IEEE publications function: {e}")
        return []