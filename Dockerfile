# Dockerfile

# Stage 1: Build React frontend application
# Use a Node.js base image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the Vite/React application. Vite outputs to a 'dist' directory by default.
RUN npm run build

# Stage 2: Run the backend proxy and serve frontend static files
# Use a lighter Node.js image to reduce the final image size
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY server.js ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the built React static files from the first stage.
# We're now copying from /app/dist instead of /app/build.
COPY --from=builder /app/dist ./build

# Expose the port the backend proxy will listen on
EXPOSE 3000

# Define the command to run when the container starts
# This starts the backend service
CMD ["node", "server.js"]
