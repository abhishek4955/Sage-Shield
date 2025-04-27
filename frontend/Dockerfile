# Use Node.js image with full build tools
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific platform
RUN npm install --platform=linux --arch=x64

# Copy rest of the files
COPY . .

# Expose port
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev", "--", "--host"] 