# Backend Dockerfile (Express/Node)
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
