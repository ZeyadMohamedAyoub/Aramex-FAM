# Use an official Node runtime as a parent image
FROM node:20-alpine AS build

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built artifacts from the build stage
COPY --from=build /usr/src/app/dist/aramex ./dist/aramex

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "run", "serve:ssr:Aramex"]