import concurrent.futures
from services.doaj_service import fetch_doaj_journals
from services.ieee_service import fetch_ieee_publications
from services.springer_service import fetch_springer_journals
from services.pubmed_service import fetch_pubmed_journals
from utils.logger import logger

def fetch_journals(query, filters):
    results = []
    logger.info(f"Fetching journal results for query: {query}")
    
    # Use concurrent.futures to fetch data from all sources in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(fetch_doaj_journals, query),
            executor.submit(fetch_ieee_publications, query),
            executor.submit(fetch_springer_journals, query),
            executor.submit(fetch_pubmed_journals, query)
        ]
        
        for future in concurrent.futures.as_completed(futures):
            try:
                results.extend(future.result())
            except Exception as e:
                logger.error(f"Error fetching journals: {e}")
    
    logger.info(f"Total results found: {len(results)}")
    
    # Apply filters
    if filters.get("open_access"):
        results = [r for r in results if r.get('open_access', False)]
    if filters.get("indexing"):
        results = [r for r in results if filters["indexing"] in r.get('status', '')]
    
    return results