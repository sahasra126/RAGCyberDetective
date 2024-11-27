# from flask import Flask, request, jsonify
# import joblib
import os
#from flask_cors import CORS  
import requests
from bs4 import BeautifulSoup
from newspaper import Article, Config
import re
from pymongo import MongoClient
from datetime import datetime, timezone
import torch
# from collections import Counter
# from transformers import BertTokenizerFast, BertForQuestionAnswering

# # Initialize the Flask app
# app = Flask(__name__)
# CORS(app, origins=["http://localhost:2000"], supports_credentials=True)

# # Paths to the saved .pkl files
# output_dir = r"C:\Users\P SAHASRA\OneDrive\Desktop\alter\backend"
# model_path = os.path.join(output_dir, "xgboost_model (1).pkl")
# vectorizer_path = os.path.join(output_dir, "vectorizer.pkl")
# mlb_path = os.path.join(output_dir, "mlb.pkl")
# #output_dir = "./backend"
# #model_path = os.path.join(output_dir, "./xgboost_model (1).pkl")
# #vectorizer_path = os.path.join(output_dir, "./vectorizer.pkl")
# #mlb_path = os.path.join(output_dir, "./mlb.pkl")

# # Load the pre-trained model, vectorizer, and MultiLabelBinarizer
# model = joblib.load(model_path)
# vectorizer = joblib.load(vectorizer_path)
# mlb = joblib.load(mlb_path)

# def predict_word_mapping_single_entity(input_text, model, vectorizer, mlb):
#     # Split the input text into words
#     words = input_text.split()

#     # Initialize the word-to-entity map
#     word_entity_map = {}

#     for word in words:
#         input_vector = vectorizer.transform([word]).toarray()
#         pred_probs = model.predict_proba(input_vector)
#         max_prob_index = pred_probs.argmax(axis=1)[0]
#         predicted_entity = mlb.classes_[max_prob_index]
#         word_entity_map[word] = predicted_entity

#     return word_entity_map

# @app.route('/process_text', methods=['POST'])
# def process_text():
#     try:
#         # Parse the JSON request
#         data = request.get_json()
#         input_text = data.get('input_text', '')

#         if not input_text:
#             return jsonify({"error": "Input text is required"}), 400

#         # Get the word-to-entity mapping
#         word_to_entity_map = predict_word_mapping_single_entity(input_text, model, vectorizer, mlb)

#         return jsonify({"word_to_entity_map": word_to_entity_map}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    

# # Setup for Spacy, Flask, MongoDB, and other libraries
# #nlp = spacy.load("en_core_web_sm")
# app = Flask(__name__)
# CORS(app, origins="http://localhost:2000", methods=["GET", "POST", "OPTIONS"])

# MongoDB setup for scraping data storage
# if __name__ == '__main__':
#     # Run the Flask app
#     app.run(debug=True, port=4200)


from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from sklearn.exceptions import NotFittedError

# Initialize Flask app
app = Flask(__name__) 
CORS(app, origins=["http://localhost:2000"], supports_credentials=True)


# Paths to model files
output_dir = r"C:\Users\P SAHASRA\OneDrive\Desktop\alter\backend"
model_path = os.path.join(output_dir, "xgboost_model (1).pkl")
vectorizer_path = os.path.join(output_dir, "vectorizer.pkl")
mlb_path = os.path.join(output_dir, "mlb.pkl")

# Load model components
try:
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    mlb = joblib.load(mlb_path)
except Exception as e:
    print(f"Error loading model components: {e}")
    model, vectorizer, mlb = None, None, None


def predict_word_mapping_single_entity(input_text, model, vectorizer, mlb):
    if not model or not vectorizer or not mlb:
        raise ValueError("Model, vectorizer, or MultiLabelBinarizer not loaded")

    words = input_text.split()
    word_entity_map = {}

    for word in words:
        try:
            input_vector = vectorizer.transform([word]).toarray()
            pred_probs = model.predict_proba(input_vector)
            max_prob_index = pred_probs.argmax(axis=1)[0]
            predicted_entity = mlb.classes_[max_prob_index]
            word_entity_map[word] = predicted_entity
        except NotFittedError as e:
            word_entity_map[word] = "Model not fitted properly"
        except Exception as e:
            word_entity_map[word] = f"Error: {e}"

    return word_entity_map



@app.route('/process_text', methods=['POST'])
def process_text():
    try:
        data = request.get_json()
        input_text = data.get('input_text', '')

        if not input_text:
            return jsonify({"error": "Input text is required"}), 400

        word_to_entity_map = predict_word_mapping_single_entity(input_text, model, vectorizer, mlb)
        return jsonify({"word_to_entity_map": word_to_entity_map}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected server error: {e}"}), 500



# client = MongoClient("mongodb+srv://sahas:sahasra@cluster0.bouhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client['web_scraping_db']
# collection = db['scraped_articles']

# # Config for scraping
# config = Config()
# config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

# save_folder = "scraped_articles"
# os.makedirs(save_folder, exist_ok=True)

# key_terms = ["cloud", "security", "hybrid", "network", "detection", "response", "managed services"]  # Define your key terms

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

# # Route for web scraping API
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

# # Route to fetch scraped files
# @app.route('/api/scraped-files', methods=['GET'])
# def get_scraped_files():
#     files = collection.find({}, {"file_name": 1, "url": 1})
#     files_list = [{'file_name': file['file_name'], 'url': file['url']} for file in files]
#     return jsonify({'articles': files_list})

# # Route to fetch specific scraped file content
# @app.route('/api/scraped-files/<file_name>', methods=['GET'])
# def get_file_content(file_name):
#     file = collection.find_one({"file_name": file_name})
#     if file:
#         return jsonify({'scraped_content': file['scraped_content']})
#     return jsonify({'error': 'File not found'}), 404
if __name__ == '__main__':
    app.run(debug=True, port=4200)
