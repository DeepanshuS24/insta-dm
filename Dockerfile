# Use Apify base image with Playwright (includes Puppeteer + Chromium)
FROM apify/actor-node-playwright:latest

# Set working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./
COPY . .

# Switch to root user to install packages and fix permissions
USER root

# Install dependencies
RUN npm install

# Set correct permissions for the node user
RUN chown -R node:node /app

# Switch back to node user
USER node

# Set path to Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Start the app
CMD ["node", "main.js"]
