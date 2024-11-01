# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your server is listening on
EXPOSE 3000

# Run your server file
CMD ["node", "server.js"]
