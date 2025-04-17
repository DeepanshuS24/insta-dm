# Use Apify's official Playwright base image
FROM apify/actor-node-playwright:latest

# Set the working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Set Puppeteer executable path (for compatibility with Playwright setup)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# (Optional) If you plan to run your app using CMD or ENTRYPOINT, you can set that here
# CMD ["node", "main.js"]
