# Build stage
FROM node:20.12.2-alpine AS build

WORKDIR /app

# Copy package.json, package-lock.json, and .env
COPY package*.json .env ./

# Install dependencies
RUN npm ci

# Copy TypeScript source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:20.12.2-bullseye-slim

WORKDIR /app

# Copy the compiled output and .env from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env .env

# Load environment variables from .env
ENV NODE_ENV=production
RUN export $(grep -v '^#' .env | xargs)

# Expose the port your application listens on (replace 3000 with your port)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]