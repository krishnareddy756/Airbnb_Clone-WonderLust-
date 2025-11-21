# Use official Node.js image as base
FROM node:22.11.0-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Set environment variable for port
ENV PORT=8002

# Expose the port your app runs on
EXPOSE 8002

# Set the command to run your app
CMD ["node", "app.js"]