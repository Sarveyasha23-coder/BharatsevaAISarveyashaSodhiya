# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Environment variable defaults
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]