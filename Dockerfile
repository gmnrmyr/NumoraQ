# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite in dev mode, listening on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]