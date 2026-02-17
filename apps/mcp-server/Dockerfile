# Use Node.js 20 slim image
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies needed for build (python/make for node-gyp if needed, though likely not for this project)
# RUN apt-get update && apt-get install -y python3 make g++

# Copy root package files
COPY package.json package-lock.json ./

# Copy package sources
COPY packages/core ./packages/core
COPY apps/mcp-server ./apps/mcp-server

# Install dependencies (including devDependencies for build)
RUN npm ci

# Build packages
WORKDIR /app/packages/core
RUN npm run build

WORKDIR /app/apps/mcp-server
RUN npm run build

# Runner stage
FROM node:20-slim AS runner
WORKDIR /app

# Copy built artifacts and node_modules from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core ./packages/core
COPY --from=builder /app/apps/mcp-server ./apps/mcp-server

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start command
WORKDIR /app/apps/mcp-server
CMD ["npm", "start"]
