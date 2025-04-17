# Use base image with Chromium + Playwright
FROM apify/actor-node-playwright:latest

# Set working directory
WORKDIR /app

# Copy files
COPY package.json package-lock.json ./

# Install dependencies as root (don't switch users)
RUN npm install

# Copy rest of the files
COPY . .

# Optional: for compatibility with Puppeteer-style launch
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run your script (main.js should be your entry point)
CMD ["node", "main.js"]
