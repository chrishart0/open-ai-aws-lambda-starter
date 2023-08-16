# Use an official Node.js runtime as the parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn) into the container
COPY package*.json ./

# Install application dependencies inside the container
RUN npm install

# Copy the rest of the application source code from your host to your image filesystem.
COPY . .

# Specify the port the app runs on for documentation purposes
EXPOSE 3000

# Command to run your application
CMD [ "npm", "run", "dev" ]
