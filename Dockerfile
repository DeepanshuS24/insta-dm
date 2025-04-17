# Use the official Apify image with Puppeteer and Node.js
FROM apify/actor-node-puppeteer:latest

# Copy all files to the container
COPY . ./

# Install dependencies
RUN npm install

# Start script
CMD ["npm", "start"]
