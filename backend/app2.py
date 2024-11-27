# import torch
# from transformers import BertTokenizer, BertForSequenceClassification, AdamW
# from torch.utils.data import DataLoader, TensorDataset, random_split
# import pandas as pd
# from sklearn.metrics import accuracy_score
# import nltk
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app, origins="http://localhost:2000")
 
# # Ensure nltk data is downloaded for BLEU scoring
# nltk.download('punkt')




# # Load dataset and prepare data
# qa_data = pd.read_csv("./Final Merged Database.csv", encoding='ISO-8859-1')

# # Create a list of unique answers (classes)
# answers = list(qa_data['Answers'].unique())

# # Create a mapping of answers to class labels
# answer_to_label = {answer: idx for idx, answer in enumerate(answers)}
# label_to_answer = {idx: answer for answer, idx in answer_to_label.items()}

# # Convert answers in the dataset to class labels
# qa_data['label'] = qa_data['Answers'].map(answer_to_label)

# # Load BERT tokenizer
# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# # Concatenate Question and Scraped Content
# qa_data['input_text'] = qa_data['Questions'] + " " + qa_data['Scraped Content']

# # Tokenize the concatenated questions and scraped content
# inputs = tokenizer(
#     qa_data['input_text'].tolist(),
#     max_length=128,
#     padding='max_length',
#     truncation=True,
#     return_tensors="pt"
# )

# input_ids = inputs['input_ids']
# attention_masks = inputs['attention_mask']
# labels = torch.tensor(qa_data['label'].values)

# # Create TensorDataset
# dataset = TensorDataset(input_ids, attention_masks, labels)

# # Split dataset into training and validation sets
# train_size = int(0.8 * len(dataset))
# val_size = len(dataset) - train_size
# train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# # DataLoader for batching
# batch_size = 16
# train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
# val_dataloader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# # Load pre-trained BERT model for Sequence Classification
# num_labels = len(answers)
# model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=num_labels)

# # Move model to GPU if available
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# model.to(device)

# # Prepare optimizer
# optimizer = AdamW(model.parameters(), lr=5e-5)

# # Training loop (You can skip this if you already have a trained model)
# # You should only run this part when you're training the model, not during API calls
# def train_model():
#     epochs = 50
#     for epoch in range(epochs):
#         model.train()
#         total_loss = 0

#         for batch in train_dataloader:
#             b_input_ids = batch[0].to(device)
#             b_attention_mask = batch[1].to(device)
#             b_labels = batch[2].to(device)

#             model.zero_grad()

#             outputs = model(input_ids=b_input_ids, attention_mask=b_attention_mask, labels=b_labels)
#             loss = outputs.loss

#             loss.backward()
#             optimizer.step()

#             total_loss += loss.item()

#         avg_train_loss = total_loss / len(train_dataloader)
#         print(f"Epoch {epoch+1} - Loss: {avg_train_loss:.4f}")

# # Prediction function
# def answer_question(question, scraped_content):
#     input_text = question + " " + scraped_content
#     inputs = tokenizer(input_text, return_tensors="pt", max_length=128, truncation=True, padding='max_length').to(device)
#     with torch.no_grad():
#         outputs = model(**inputs)

#     predicted_class = torch.argmax(outputs.logits, dim=1).item()
#     return label_to_answer[predicted_class]

# # Define API route for predicting answers
# @app.route('/predict', methods=['POST'])
# def predict():
#     print("Received request")
#     try:
#         data = request.get_json()
#         question = data.get('question')
#         scraped_content = data.get('scraped_content')

#         if not question or not scraped_content:
#             return jsonify({"error": "Both 'question' and 'scraped_content' are required"}), 400

#         predicted_answer = answer_question(question, scraped_content)
#         return jsonify({"predicted_answer": predicted_answer})
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 500


# # Define an endpoint to evaluate the model (if needed)
# @app.route('/evaluate', methods=['GET'])
# def evaluate():
#     model.eval()
#     true_labels = []
#     predicted_labels = []

#     for index, row in qa_data.iterrows():
#         question = row['Questions']
#         scraped_content = row['Scraped Content']
#         true_answer = row['Answers']
#         predicted_answer = answer_question(question, scraped_content)

#         true_label = answer_to_label[true_answer]
#         predicted_label = answer_to_label[predicted_answer]

#         true_labels.append(true_label)
#         predicted_labels.append(predicted_label)

#     accuracy = accuracy_score(true_labels, predicted_labels)
#     return jsonify({"accuracy": accuracy * 100})

# if __name__ == '__main__':
#     # If you need to train the model, uncomment the next line
#     # train_model()

#     app.run(debug=True, port=4000)




# from flask import Flask, request, jsonify
# import joblib
# import json
# import pandas as pd
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.preprocessing import MultiLabelBinarizer

# # Initialize Flask app
# app = Flask(__name__)

# # Load pre-trained model, vectorizer, and label binarizer
# model = joblib.load("C:\\Users\\P SAHASRA\\OneDrive\\Desktop\\output\\xgboost_model.pkl")
# vectorizer = joblib.load("C:\\Users\\P SAHASRA\\OneDrive\\Desktop\\output\\vectorizer.pkl")
# mlb = joblib.load("C:\\Users\\P SAHASRA\\OneDrive\\Desktop\\output\\mlb.pkl")

# @app.route("/generate-count", methods=["POST"])
# def generate_count():
#     """
#     Generate entity counts from the input text.
#     """
#     data = request.get_json()
#     input_text = data.get("text", "")

#     if not input_text:
#         return jsonify({"error": "Input text is required"}), 400

#     input_vector = vectorizer.transform([input_text]).toarray()
#     pred_probs = model.predict_proba(input_vector)

#     # Apply threshold and get predicted tags
#     threshold = 0.1
#     y_pred = (pred_probs >= threshold).astype(int)
#     predicted_tags = mlb.inverse_transform(y_pred)

#     # Count the occurrences of each tag
#     tag_counts = {}
#     for tags in predicted_tags:
#         for tag in tags:
#             tag_counts[tag] = tag_counts.get(tag, 0) + 1

#     return jsonify({"tag_counts": tag_counts})

# @app.route("/annotate", methods=["POST"])
# def annotate_text():
#     """
#     Annotate each word in the input text with the most relevant entity class.
#     """
#     data = request.get_json()
#     input_text = data.get("text", "")

#     if not input_text:
#         return jsonify({"error": "Input text is required"}), 400

#     words = input_text.split()
#     word_entity_map = {}

#     for word in words:
#         input_vector = vectorizer.transform([word]).toarray()
#         pred_probs = model.predict_proba(input_vector)
#         max_prob_index = pred_probs.argmax(axis=1)[0]
#         predicted_entity = mlb.classes_[max_prob_index]
#         word_entity_map[word] = predicted_entity

#     return jsonify({"word_entity_map": word_entity_map})

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, AdamW
from torch.utils.data import DataLoader, TensorDataset, random_split
import pandas as pd
from sklearn.metrics import accuracy_score
import nltk

# Ensure nltk data is downloaded for BLEU scoring
nltk.download('punkt')

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # Enable CORS for all routes, you can limit this to specific domains later

# Load dataset
qa_data = pd.read_csv("./QA pairs for Specific_Content.csv", encoding='ISO-8859-1')

# Create a list of unique answers (classes)
answers = list(qa_data['Ground Truth'].unique())

# Create a mapping of answers to class labels
answer_to_label = {answer: idx for idx, answer in enumerate(answers)}
label_to_answer = {idx: answer for answer, idx in answer_to_label.items()}

# Convert answers in the dataset to class labels
qa_data['label'] = qa_data['Ground Truth'].map(answer_to_label)

# Load DistilBERT tokenizer
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

# Tokenize the questions
inputs = tokenizer(
    qa_data['Question'].tolist(),
    max_length=128,
    padding='max_length',
    truncation=True,
    return_tensors="pt"
)

input_ids = inputs['input_ids']
attention_masks = inputs['attention_mask']
labels = torch.tensor(qa_data['label'].values)

# Create TensorDataset
dataset = TensorDataset(input_ids, attention_masks, labels)

# Split dataset into training and validation sets
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# DataLoader for batching
batch_size = 16
train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_dataloader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# Load pre-trained DistilBERT model for Sequence Classification
num_labels = len(answers)
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=num_labels)

# Move model to GPU if available
device = torch.device("cpu")  # Change to "cuda" if using GPU
model.to(device)

# Prepare optimizer
optimizer = AdamW(model.parameters(), lr=5e-5)

# Training loop
epochs = 10
for epoch in range(epochs):
    model.train()
    total_loss = 0

    for batch in train_dataloader:
        # Unpack the batch and move to the appropriate device
        b_input_ids = batch[0].to(device)
        b_attention_mask = batch[1].to(device)
        b_labels = batch[2].to(device)

        # Zero the gradients
        model.zero_grad()

        # Forward pass
        outputs = model(input_ids=b_input_ids, attention_mask=b_attention_mask, labels=b_labels)
        loss = outputs.loss

        # Backward pass and optimization
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_train_loss = total_loss / len(train_dataloader)
    print(f"Epoch {epoch+1} - Loss: {avg_train_loss:.4f}")

# Prediction function
def answer_question(question):
    inputs = tokenizer(question, return_tensors="pt", max_length=128, truncation=True, padding='max_length').to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted class (the most likely answer)
    predicted_class = torch.argmax(outputs.logits, dim=1).item()
    return label_to_answer[predicted_class]

# API endpoint for question answering
@app.route('/api/qa', methods=['POST'])
def qa():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    # Get the answer from the model
    answer = answer_question(question)
    return jsonify({'answer': answer})

# API endpoint for model evaluation
@app.route('/api/evaluate', methods=['GET'])
def evaluate_model():
    model.eval()
    true_labels = []
    predicted_labels = []

    for index, row in qa_data.iterrows():
        question = row['Question']
        true_answer = row['Ground Truth']
        predicted_answer = answer_question(question)

        # Convert true and predicted answers to labels
        true_label = answer_to_label[true_answer]
        predicted_label = answer_to_label[predicted_answer]

        true_labels.append(true_label)
        predicted_labels.append(predicted_label)

    # Compute overall accuracy
    accuracy = accuracy_score(true_labels, predicted_labels)
    return jsonify({'accuracy': accuracy * 100})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)