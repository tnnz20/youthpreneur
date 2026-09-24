# Stage 1: Build frontend application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications and install cleanly
COPY package*.json ./
RUN npm ci

# Copy full source tree
COPY . .

# Build-time arguments for environment and API URL
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG VITE_APP_ENV=production
ENV VITE_APP_ENV=$VITE_APP_ENV

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundle
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine AS runner

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
