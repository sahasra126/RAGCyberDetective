
# from flask import Flask, request, jsonify
# from flask_cors import CORS  # Import CORS
# import torch
# from transformers import BertTokenizer, BertForSequenceClassification, AdamW
# from torch.utils.data import DataLoader, TensorDataset, random_split
# import pandas as pd
# from sklearn.metrics import accuracy_score
# import nltk
# from nltk.translate.bleu_score import sentence_bleu

# # Ensure nltk data is downloaded for BLEU scoring
# nltk.download('punkt')
# #nltk.data.path.append('./backend/nltk') 
# # Initialize Flask app
# app = Flask(__name__)

# # Enable CORS for all routes
# #CORS(app)  # Enable CORS for all routes, you can limit this to specific domains later
# CORS(app, origins="http://localhost:2000",methods=["GET", "POST", "OPTIONS"], supports_credentials=True)

# # Load dataset
# qa_data = pd.read_csv("./QA pairs for Specific_Content.csv", encoding='ISO-8859-1')

# # Create a list of unique answers (classes)
# answers = list(qa_data['Ground Truth'].unique())

# # Create a mapping of answers to class labels
# answer_to_label = {answer: idx for idx, answer in enumerate(answers)}
# label_to_answer = {idx: answer for answer, idx in answer_to_label.items()}

# # Convert answers in the dataset to class labels
# qa_data['label'] = qa_data['Ground Truth'].map(answer_to_label)

# # Load BERT tokenizer
# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# # Tokenize the questions
# inputs = tokenizer(
#     qa_data['Question'].tolist(),
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
# device = torch.device("cpu")  # Change to "cuda" if using GPU
# model.to(device)

# # Prepare optimizer
# optimizer = AdamW(model.parameters(), lr=5e-5)

# # Training loop
# epochs = 10
# for epoch in range(epochs):
#     model.train()
#     total_loss = 0

#     for batch in train_dataloader:
#         # Unpack the batch and move to the appropriate device
#         b_input_ids = batch[0].to(device)
#         b_attention_mask = batch[1].to(device)
#         b_labels = batch[2].to(device)

#         # Zero the gradients
#         model.zero_grad()

#         # Forward pass
#         outputs = model(input_ids=b_input_ids, attention_mask=b_attention_mask, labels=b_labels)
#         loss = outputs.loss

#         # Backward pass and optimization
#         loss.backward()
#         optimizer.step()

#         total_loss += loss.item()

#     avg_train_loss = total_loss / len(train_dataloader)
#     print(f"Epoch {epoch+1} - Loss: {avg_train_loss:.4f}")

# # Prediction function
# def answer_question(question):
#     inputs = tokenizer(question, return_tensors="pt", max_length=128, truncation=True, padding='max_length').to(device)
#     with torch.no_grad():
#         outputs = model(**inputs)

#     # Get the predicted class (the most likely answer)
#     predicted_class = torch.argmax(outputs.logits, dim=1).item()
#     return label_to_answer[predicted_class]
# def compute_bleu(true_answer, predicted_answer):
#     true_answer_tokens = nltk.word_tokenize(true_answer.lower())
#     predicted_answer_tokens = nltk.word_tokenize(predicted_answer.lower())
#     return sentence_bleu([true_answer_tokens], predicted_answer_tokens)

# # API endpoint for question answering
# @app.route('/api/qa', methods=['POST'])
# def qa():
#     data = request.get_json()
#     question = data.get('question')

#     if not question:
#         return jsonify({'error': 'No question provided'}), 400

#     # Get the answer from the model
#     answer = answer_question(question)
#     return jsonify({'answer': answer})

# # API endpoint for model evaluation
# # @app.route('/api/evaluate', methods=['GET'])
# # def evaluate_model():
# #     model.eval()
# #     true_labels = []
# #     predicted_labels = []
# #     bleu_scores = []

# #     for index, row in qa_data.iterrows():
# #         question = row['Question']
# #         true_answer = row['Ground Truth']
# #         predicted_answer = answer_question(question)

# #         # Convert true and predicted answers to labels
# #         true_label = answer_to_label[true_answer]
# #         predicted_label = answer_to_label[predicted_answer]

# #         true_labels.append(true_label)
# #         predicted_labels.append(predicted_label)

# #         # Compute BLEU score
# #         bleu_score = compute_bleu(true_answer, predicted_answer)
# #         bleu_scores.append(bleu_score)

# #     # Compute overall accuracy
# #     accuracy = accuracy_score(true_labels, predicted_labels)
# #     average_bleu_score = sum(bleu_scores) / len(bleu_scores)

# #     return jsonify({'accuracy': accuracy * 100, 'average_bleu_score': average_bleu_score})


# @app.route('/api/evaluate', methods=['GET'])
# def evaluate_model():
#     model.eval()
#     true_labels = []
#     predicted_labels = []

#     for index, row in qa_data.iterrows():
#         question = row['Question']
#         true_answer = row['Ground Truth']
#         predicted_answer = answer_question(question)

#         # Convert true and predicted answers to labels
#         true_label = answer_to_label[true_answer]
#         predicted_label = answer_to_label[predicted_answer]

#         true_labels.append(true_label)
#         predicted_labels.append(predicted_label)

#     # Compute overall accuracy
#     accuracy = accuracy_score(true_labels, predicted_labels)
#     return jsonify({'accuracy': accuracy * 100})

# # Run the Flask app
# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=4000)


from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import pandas as pd
import os
import nltk
from sklearn.metrics import accuracy_score
# from nltk.translate.bleu_score import sentence_bleu
# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins="http://localhost:2000", methods=["GET", "POST", "OPTIONS"], supports_credentials=True)

# Load the pre-trained model and tokenizer (qamodel)
model_dir = 'C:/Users/P SAHASRA/OneDrive/Desktop/alter/backend/qamodel'
tokenizer = DistilBertTokenizer.from_pretrained(model_dir)
model = DistilBertForSequenceClassification.from_pretrained(model_dir)

# Move model to the appropriate device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load dataset for mapping labels to answers (if needed)
qa_data = pd.read_csv("./CleanedQuestionsAnswersCSV.csv", encoding='ISO-8859-1')
answers = list(qa_data['Ground Truth'].unique())
answer_to_label = {answer: idx for idx, answer in enumerate(answers)}
label_to_answer = {idx: answer for answer, idx in answer_to_label.items()}
 # Prediction function
def answer_question(question):
    inputs = tokenizer(question, return_tensors="pt", max_length=128, truncation=True, padding='max_length').to(device)
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted class (the most likely answer)
    predicted_class = torch.argmax(outputs.logits, dim=1).item()
    return label_to_answer[predicted_class]
@app.route('/api/qa', methods=['POST'])
def qa():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    # Get the answer from the model
    answer = answer_question(question)
    return jsonify({'answer': answer})
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
    app.run(debug=True, port=4000)
