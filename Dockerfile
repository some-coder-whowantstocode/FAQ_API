# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 9310

# Define environment variables
ENV PORT=9310
ENV MONGO_URI=mongodb://mongodb:27017/translate
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Command to run the application
CMD ["node", "src/index.js"]
