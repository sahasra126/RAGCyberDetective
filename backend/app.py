
import os
#from flask_cors import CORS  
import requests
from bs4 import BeautifulSoup
from newspaper import Article, Config
import re
from pymongo import MongoClient
from datetime import datetime, timezone
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from sklearn.exceptions import NotFittedError

# Initialize Flask app
app = Flask(__name__) 
CORS(app, origins=["http://localhost:2000"], supports_credentials=True)


# Paths to model files
output_dir="/app"#for docker
#output_dir = r"C:\Users\P SAHASRA\OneDrive\Desktop\alter\backend"
model_path = os.path.join(output_dir, "xgboost_model.pkl")
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
if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0", port=4200)


# from flask import Flask, request, jsonify
# from flask_pymongo import PyMongo
# from bs4 import BeautifulSoup
# import requests
# import os
# import re
# from datetime import datetime

# app = Flask(__name__)

# # MongoDB configuration
# app.config["MONGO_URI"] = "mongodb://localhost:27017/scraped_data"
# mongo = PyMongo(app)

# # Folder to save scraped files locally
# SCRAPED_FILES_FOLDER = "./scraped_files"
# os.makedirs(SCRAPED_FILES_FOLDER, exist_ok=True)

# # Function to clean text
# def clean_text(text):
#     text = re.sub(r'[^\w\s.,]', '', text)  # Remove special characters except punctuation
#     text = re.sub(r'\s+', ' ', text).strip()  # Normalize whitespace
#     return text

# # Function to scrape website content
# def scrape_website(url):
#     headers = {
#         "User-Agent": (
#             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
#             "(KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
#         )
#     }
#     response = requests.get(url, headers=headers, timeout=10)
#     response.raise_for_status()
#     soup = BeautifulSoup(response.content, "html.parser")
#     paragraphs = soup.find_all("p")
#     text = " ".join([p.get_text() for p in paragraphs])
#     return clean_text(text)

# @app.route("/api/scrape", methods=["POST"])
# def scrape_and_store():
#     try:
#         data = request.get_json()
#         url = data.get("url")
        
#         if not url:
#             return jsonify({"error": "URL is required"}), 400

#         # Scrape the website
#         scraped_text = scrape_website(url)

#         # Clean and create a base filename for saving files
#         base_filename = url.replace("https://", "").replace("http://", "")
#         base_filename = "".join(c for c in base_filename if c.isalnum() or c in ("_", "-"))

#         # Save scraped text to local file
#         timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#         filename = f"{base_filename}_{timestamp}.txt"
#         filepath = os.path.join(SCRAPED_FILES_FOLDER, filename)
#         with open(filepath, "w", encoding="utf-8") as file:
#             file.write(scraped_text)

#         # Store data in MongoDB
#         scraped_data = {
#             "url": url,
#             "content": scraped_text,
#             "file_path": filepath,
#             "scraped_at": datetime.utcnow(),
#         }
#         mongo.db.scraped_data.insert_one(scraped_data)

#         return jsonify({
#             "message": "Scraping successful",
#             "file_path": filepath,
#             "data_id": str(scraped_data["_id"]),
#         }), 200
#     except requests.exceptions.RequestException as e:
#         return jsonify({"error": f"Request failed: {str(e)}"}), 500
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True, port=4200)
