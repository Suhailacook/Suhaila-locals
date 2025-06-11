# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
