# Use Node.js to build and serve the React app
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/package.json
RUN npm install

# Copy the rest of the React app
COPY . /app

# Set the port environment variable to 2000
ENV PORT=2000

# Expose port 2000 for the React app
EXPOSE 2000

# Start the React app in development mode
CMD ["npm", "start"]
