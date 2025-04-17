# Use Apify's Puppeteer + Chrome base image (Node.js 16)
FROM apify/actor-node-puppeteer-chrome:16

# Set environment variables to use the preinstalled Chrome and skip Chromium download
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy all files to the container
COPY . ./

# Install dependencies
RUN npm install

# Set the entrypoint (Apify runs this command)
CMD ["node", "main.js"]
