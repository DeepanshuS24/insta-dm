# Use Apify's Playwright image (has Chromium & Playwright ready)
FROM apify/actor-node-playwright:latest

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies as root (safe in Docker)
RUN npm install

# Copy rest of the code
COPY . .

# Set Puppeteer/Playwright browser path env (in case you switch to Puppeteer)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run your script
CMD ["node", "main.js"]
