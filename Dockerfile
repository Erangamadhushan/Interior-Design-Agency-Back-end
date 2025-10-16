# Use node version 22 on Alpine Linux 3.18 as the base image
FROM node:22-alpine3.18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the contents of the local directory to the WORKDIR(/app) of the container
COPY . .

# Install the dependencies specified in package.json
RUN npm install

# Expose port 5000 to allow incoming connections to the container
EXPOSE 5000

# Start the application by running the "npm start" command
CMD ["npm", "start"]

# Alternative Dockerfile for a Node.js application
# Use the 22-alpine3.18 version of the Node.js image as the base image


