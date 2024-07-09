# Use an official Node runtime as a parent image
FROM node:22.3.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the script to generate the secret
COPY ./generate_secret.sh /app/generate_secret.sh

# Make the script executable
RUN chmod +x /app/generate_secret.sh

# Run the script to generate the .env file
RUN /app/generate_secret.sh

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD ["sh", "-c", "npm run seed && npm run dev --host 0.0.0.0"]
