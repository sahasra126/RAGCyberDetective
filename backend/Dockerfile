# Use official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json /app/package.json
RUN npm install

# Copy the rest of the application code
COPY  .  /app
COPY CleanedQuestionsAnswers_NoDiamonds.json /app/CleanedQuestionsAnswers_NoDiamonds.json
#COPY path/to/CleanedQuestionsAnswers_NoDiamonds.json /app/CleanedQuestionsAnswers_NoDiamonds.json

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

# #2nd trail of the code
# # Use official Python 3.12 image
# FROM python:3.12

# # Set working directory for Python apps
# WORKDIR /app

# # Install Supervisor to manage multiple Flask processes
# RUN apt-get update && apt-get install -y supervisor

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy Flask app code into the container
# COPY . .
# COPY ner_model /app/ner_model
# # Copy Supervisor config to manage multiple Flask apps
# COPY supervisord.conf /etc/supervisor/supervisord.conf

# # Expose necessary ports for Flask apps
# EXPOSE 4200 4300 4400 4000

# # Run Supervisor to manage the Flask apps
# CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# # Use official Node.js image for Node.js part
# FROM node:16

# # Set working directory for Node.js apps
# WORKDIR /app

# # Copy and install dependencies for Node.js
# COPY package.json /app/package.json
# RUN npm install

# # Copy Node.js application code
# COPY . /app

# # Expose the port for Node.js server
# EXPOSE 5000

# # Start the Node.js server
# CMD ["node", "server.js"]
