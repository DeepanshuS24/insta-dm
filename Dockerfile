# Use Apify's official Puppeteer-ready image
FROM apify/actor-node-puppeteer:16

# Copy everything from your local project into the Docker image
COPY . ./

# Install your dependencies
RUN npm install

# Define the default command to run your actor
CMD ["npm", "start"]
