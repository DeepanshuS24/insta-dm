FROM apify/actor-node-playwright:latest

# Change to the working directory
WORKDIR /app

# Copy your files
COPY package.json package-lock.json ./
COPY . .

# Install dependencies
RUN npm install

# Set environment variables for Puppeteer/Playwright (important for headless environments like Apify)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Make sure everything is accessible
RUN chown -R node:node /app

# Set user to 'node' (Apify runs as node user)
USER node

# Define the command to run your script
CMD ["node", "main.js"]
