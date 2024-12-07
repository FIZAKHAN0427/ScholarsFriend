from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)

# URL for the cloned journals list
url = 'https://ugccare.unipune.ac.in/Apps1/User/Web/CloneJournalsGroupIINew'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36'
}

def format_journal_entry(entry):
    # Remove \r and \n characters before formatting
    entry = entry.replace('\r', '').replace('\n', '')  # Remove unwanted carriage returns and newlines
    # Split attributes by key phrases to create new lines
    entry = entry.replace("Title -", "<br>Title -") \
                 .replace("Language :", "<br>Language :") \
                 .replace("Publisher :", "<br>Publisher :") \
                 .replace("Publisher:", "<br>Publisher:") \
                 .replace("ISSN :", "<br>ISSN :") \
                 .replace("EISSN:", "<br>EISSN:") \
                 .replace("URL :", "<br>URL :")
    return entry

@app.route('/', methods=['GET', 'POST'])
def index():
    data = []
    cloned_status = ""

    # Fetch and parse the cloned journals page
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find('table')

        # Check if the table exists
        if table:
            rows = table.find_all('tr')
            
            for row in rows[1:]:  # Skip header row
                cols = row.find_all('td')
                cols = [col.text.strip() for col in cols]  # Remove extra spaces

                # Ensure only 3 columns (Sr. No., Included in UGC List, Cloned Journals)
                # while len(cols) < 3:
                #     cols.append("N/A")

                # Apply formatting for journal entries
                if len(cols) >= 3:
                    cols[1] = format_journal_entry(cols[1])  # Format Included in UGC List
                    cols[2] = format_journal_entry(cols[2])  # Format Cloned Journals
                    data.append(cols[:3])  

            # Convert data into a DataFrame with only 3 columns
            columns = ["Sr. No.", "Included in UGC List", "Cloned Journals"]
            df = pd.DataFrame(data, columns=columns)

            # Remove rows where all columns are "N/A"
            df = df[(df != "N/A").any(axis=1)]

            # Process POST request for journal search
            if request.method == 'POST':
                journal_name = request.form['journal_name'].strip().lower()

                # Convert journal names in DataFrame to lowercase for comparison
                df["Included in UGC List"] = df["Included in UGC List"].str.strip().str.lower()
                
                # Check if the journal is listed as cloned
                is_cloned = df["Included in UGC List"].str.contains(journal_name, case=False).any()

                if is_cloned:
                    cloned_status = f"The journal '{journal_name}' is listed as a cloned journal."
                else:
                    cloned_status = f"The journal '{journal_name}' is NOT listed as a cloned journal."

            # Render the HTML table with the specified columns
            journal_table = df.to_html(classes='table table-striped', index=False, escape=False)
            return render_template('index.html', journal_table=journal_table, cloned_status=cloned_status)

    else:
        cloned_status = f"Failed to retrieve the page. Status code: {response.status_code}"
    
    return render_template('index.html', journal_table="", cloned_status=cloned_status)

if __name__ == '__main__':
    app.run(debug=True)
