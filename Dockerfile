# Use base image with Chromium and Playwright preinstalled
FROM apify/actor-node-playwright:latest

# Set working directory
WORKDIR /app

# Switch to root for permission fixes
USER root

# Copy dependency files and install as root
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Optional Puppeteer chromium path env var
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run the script
CMD ["node", "main.js"]
