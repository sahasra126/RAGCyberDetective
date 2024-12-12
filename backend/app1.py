# import os
# import requests
# from bs4 import BeautifulSoup
# from newspaper import Article, Config
# import re
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from datetime import datetime, timezone
# import spacy
# from transformers import BertTokenizerFast, BertForQuestionAnswering

# # Initialize Spacy model
# nlp = spacy.load("en_core_web_sm")

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:2000"}})


# # MongoDB setup
# client = MongoClient("mongodb://localhost:27017/")
# db = client['web_scrap']
# collection = db['scraped_articles']

# # Config for web scraping
# config = Config()
# config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

# # Folder for saving articles locally
# save_folder = "scraped_articles"
# os.makedirs(save_folder, exist_ok=True)

# # Key terms for filtering articles
# key_terms = ["cloud", "security", "hybrid", "network", "detection", "response", "managed services"]

# def sanitize_filename(title):
#     """Sanitize file name by removing invalid characters."""
#     return re.sub(r'[\\/*?:"<>|]', "", title)

# def scrape_articles(site):
#     """Scrape articles from the given website."""
#     saved_articles = []
#     response = requests.get(site, headers={'User-Agent': config.browser_user_agent})
#     soup = BeautifulSoup(response.text, 'html.parser')
#     article_links = soup.find_all('a', href=True)

#     for link in article_links:
#         url = link['href']
#         if not url.startswith('http'):
#             url = site + url

#         try:
#             article = Article(url, config=config)
#             article.download()
#             article.parse()

#             # Check if any key term exists in the article text
#             if any(term in article.text for term in key_terms):
#                 title = sanitize_filename(article.title)
#                 file_path = os.path.join(save_folder, f"{title}.txt")

#                 if os.path.exists(file_path):
#                     continue

#                 # Save file locally
#                 with open(file_path, 'w', encoding='utf-8') as f:
#                     f.write(f"Title: {article.title}\n")
#                     f.write(f"URL: {url}\n")
#                     f.write(f"Published Date: {article.publish_date}\n\n")
#                     f.write(article.text)

#                 # Save data to MongoDB
#                 scraped_data = {
#                     "file_name": f"{title}.txt",
#                     "url": url,
#                     "scraped_content": article.text,
#                     "timestamp": datetime.now(timezone.utc)
#                 }
#                 collection.insert_one(scraped_data)

#                 saved_articles.append({'title': title, 'url': url})
#         except Exception as e:
#             print(f"Failed to scrape {url}: {e}")

#     return saved_articles

# @app.route('/api/scrape', methods=['POST'])
# def scrape():
#     """API endpoint to scrape articles."""
#     data = request.json
#     target_site = data.get('url')

#     if not target_site:
#         return jsonify({'error': 'URL is required'}), 400

#     try:
#         articles = scrape_articles(target_site)
#         return jsonify({'message': 'Scraping completed', 'articles': articles}), 200
#     except Exception as e:
#         return jsonify({'error': 'An error occurred during scraping', 'details': str(e)}), 500

# @app.route('/api/scraped-files', methods=['GET'])
# def get_scraped_files():
#     """API endpoint to get list of scraped files."""
#     files = collection.find({}, {"file_name": 1, "url": 1})
#     files_list = [{'file_name': file['file_name'], 'url': file['url']} for file in files]
#     return jsonify({'articles': files_list})

# @app.route('/api/scraped-files/<file_name>', methods=['GET'])
# def get_file_content(file_name):
#     """API endpoint to get content of a specific file."""
#     file = collection.find_one({"file_name": file_name})
#     if file:
#         return jsonify({'scraped_content': file['scraped_content']})
#     return
# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=4300)

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS for handling cross-origin requests
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Function to clean text
def clean_text(text):
    # Remove numbers, special characters, and extra whitespace
    text = re.sub(r'[^\w\s.,]', '', text)  # Remove special characters except punctuation
    text = re.sub(r'\s+', ' ', text).strip()  # Normalize whitespace
    return text

# Function to scrape content using BeautifulSoup
def scrape_website(url):
    try:
        headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                '(KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            )
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)

        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract text from paragraph tags
        paragraphs = soup.find_all('p')
        text = ' '.join([p.get_text() for p in paragraphs])
        return clean_text(text)

    except requests.exceptions.HTTPError as http_err:
        raise Exception(f"HTTP error occurred: {http_err}")
    except Exception as err:
        raise Exception(f"Other error occurred: {err}")

# Define the scrape endpoint
@app.route('/api/scrape', methods=['POST'])
def scrape():
    try:
        data = request.get_json()
        url = data.get('url')

        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        # Scrape the content from the provided URL
        scraped_text = scrape_website(url)

        # Save the scraped content to a file (optional)
        base_filename = url.replace("https://", "").replace("http://", "")
        base_filename = ''.join(c for c in base_filename if c.isalnum() or c in ('_', '-'))

        scraped_txt_filename = f"{base_filename}.txt"
        with open(scraped_txt_filename, 'w', encoding='utf-8') as file:
            file.write(scraped_text)

        # Respond with the scraped text (or can return metadata)
        return jsonify({
            'message': 'Scraping successful',
            'scraped_text': scraped_text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4300)
