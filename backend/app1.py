import os
import requests
from bs4 import BeautifulSoup
from newspaper import Article, Config
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timezone
import spacy
from transformers import BertTokenizerFast, BertForQuestionAnswering

# Initialize Spacy model
nlp = spacy.load("en_core_web_sm")

# Initialize Flask app
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:2000"}})


# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client['web_scrap']
collection = db['scraped_articles']

# Config for web scraping
config = Config()
config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

# Folder for saving articles locally
save_folder = "scraped_articles"
os.makedirs(save_folder, exist_ok=True)

# Key terms for filtering articles
key_terms = ["cloud", "security", "hybrid", "network", "detection", "response", "managed services"]

def sanitize_filename(title):
    """Sanitize file name by removing invalid characters."""
    return re.sub(r'[\\/*?:"<>|]', "", title)

def scrape_articles(site):
    """Scrape articles from the given website."""
    saved_articles = []
    response = requests.get(site, headers={'User-Agent': config.browser_user_agent})
    soup = BeautifulSoup(response.text, 'html.parser')
    article_links = soup.find_all('a', href=True)

    for link in article_links:
        url = link['href']
        if not url.startswith('http'):
            url = site + url

        try:
            article = Article(url, config=config)
            article.download()
            article.parse()

            # Check if any key term exists in the article text
            if any(term in article.text for term in key_terms):
                title = sanitize_filename(article.title)
                file_path = os.path.join(save_folder, f"{title}.txt")

                if os.path.exists(file_path):
                    continue

                # Save file locally
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(f"Title: {article.title}\n")
                    f.write(f"URL: {url}\n")
                    f.write(f"Published Date: {article.publish_date}\n\n")
                    f.write(article.text)

                # Save data to MongoDB
                scraped_data = {
                    "file_name": f"{title}.txt",
                    "url": url,
                    "scraped_content": article.text,
                    "timestamp": datetime.now(timezone.utc)
                }
                collection.insert_one(scraped_data)

                saved_articles.append({'title': title, 'url': url})
        except Exception as e:
            print(f"Failed to scrape {url}: {e}")

    return saved_articles

@app.route('/api/scrape', methods=['POST'])
def scrape():
    """API endpoint to scrape articles."""
    data = request.json
    target_site = data.get('url')

    if not target_site:
        return jsonify({'error': 'URL is required'}), 400

    try:
        articles = scrape_articles(target_site)
        return jsonify({'message': 'Scraping completed', 'articles': articles}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred during scraping', 'details': str(e)}), 500

@app.route('/api/scraped-files', methods=['GET'])
def get_scraped_files():
    """API endpoint to get list of scraped files."""
    files = collection.find({}, {"file_name": 1, "url": 1})
    files_list = [{'file_name': file['file_name'], 'url': file['url']} for file in files]
    return jsonify({'articles': files_list})

@app.route('/api/scraped-files/<file_name>', methods=['GET'])
def get_file_content(file_name):
    """API endpoint to get content of a specific file."""
    file = collection.find_one({"file_name": file_name})
    if file:
        return jsonify({'scraped_content': file['scraped_content']})
    return
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4300)

# import os
# import requests
# from bs4 import BeautifulSoup
# from newspaper import Article, Config
# import re
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from datetime import datetime, timezone


# # const cors = require('cors');
# # app.use(cors());
# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "*"}})
# #CORS(app)

# # MongoDB setup
# client = MongoClient("mongodb://localhost:27017/")
# db = client['web_scraping']
# collection = db['scraped_articles']

# # Config for scraping
# config = Config()
# config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

# save_folder = "scraped_articles"
# os.makedirs(save_folder, exist_ok=True)

# key_terms = ["cloud", "security", "hybrid", "network", "detection", "response", "managed services"]  # Define your key terms here

# def sanitize_filename(title):
#     return re.sub(r'[\\/*?:"<>|]', "", title)

# def scrape_articles(site):
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

#             # Check if any key term exists in the article text without using .lower()
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
#     data = request.json
#     target_site = data.get('url')
#     print(f"Received URL: {target_site}") 

#     if not target_site:
#         return jsonify({'error': 'URL is required'}), 400
#     print(f"Scraping URL: {target_site}") 
#     try:
#         articles = scrape_articles(target_site)
#         return jsonify({'message': 'Scraping completed', 'articles': articles}), 200
#     except Exception as e:
#         return jsonify({'error': 'An error occurred during scraping', 'details': str(e)}), 500

# @app.route('/api/scraped-files', methods=['GET'])
# def get_scraped_files():
#     files = collection.find({}, {"file_name": 1, "url": 1})
#     files_list = [{'file_name': file['file_name'], 'url': file['url']} for file in files]
#     return jsonify({'articles': files_list})
#     # //return jsonify({'articles': list(files)})

# @app.route('/api/scraped-files/<file_name>', methods=['GET'])
# def get_file_content(file_name):
#     file = collection.find_one({"file_name": file_name})
#     if file:
#         return jsonify({'scraped_content': file['scraped_content']})
#     return jsonify({'error': 'File not found'}), 404

# if __name__ == "__main__":
#     app.run(debug=True, port=4300)