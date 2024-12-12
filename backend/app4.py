# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import spacy

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Load the trained NER model
# nlp = spacy.load("C:/Users/P SAHASRA/OneDrive/Desktop/react/backend/ner_model")

# @app.route("/predict-spacy", methods=["POST"])
# def predict():
#     try:
#         data = request.json
#         text = data.get("text", "")
#         if not text:
#             return jsonify({"error": "No text provided"}), 400

#         doc = nlp(text)
#         entities = []
#         for ent in doc.ents:
#             entities.append({
#                 "text": ent.text,
#                 "label_": ent.label_,
#                 # "start": ent.start_char,
#                 # "end": ent.end_char
#             })

#         return jsonify({"entities": entities})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(port=4400, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the trained NER model
nlp = spacy.load("/app/ner_model")#for docker

#nlp = spacy.load("C:/Users/P SAHASRA/OneDrive/Desktop/react/backend/ner_model")
# Filter out entries where all tags are "O"
# filtered_data = [
#         entry for entry in data if any(tag != "O" for tag in entry['tags'])
# ]
# return filtered_data

@app.route("/predict-spacy", methods=["POST"])
def predict():
    try:
        data = request.json
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        doc = nlp(text)
        entities = []
        
        # Iterate through tokens and assign labels
        for token in doc:
            # Check if the token is part of an entity
            if token.ent_type_:
                entities.append({
                    "text": token.text,
                    "label": token.ent_type_  # Assign the entity label
                })
            else:
                entities.append({
                    "text": token.text,
                    "label": "O"  # Assign "O" for tokens that are not part of any entity
                })

        return jsonify({"entities": entities})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# @app.route("/predict-spacy", methods=["POST"])
# def predict():
#     try:
#         data = request.json
#         text = data.get("text", "")
#         if not text:
#             return jsonify({"error": "No text provided"}), 400

#         doc = nlp(text)
#         entities = []

#         # Iterate through sentences in the document
#         for sent in doc.sents:
#             sentence_entities = []  # Store entities for the current sentence
#             has_entity = False

#             for token in sent:
#                 if token.ent_type_:  # Check if token is part of an entity
#                     sentence_entities.append({
#                         "text": token.text,
#                         "label": token.ent_type_
#                     })
#                     has_entity = True
#                 else:
#                     sentence_entities.append({
#                         "text": token.text,
#                         "label": "O"
#                     })

#             # Only include sentences that have at least one labeled entity
#             if has_entity:
#                 entities.extend(sentence_entities)

#         return jsonify({"entities": entities})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=4400,host="0.0.0.0", debug=True)
