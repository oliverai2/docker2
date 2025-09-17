# Multi-stage Dockerfile für React-Anwendung
# Stage 1: Build the React application
FROM node:18-alpine AS build

# Installiere Abhängigkeiten für native Pakete
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json* zuerst für besseres Docker Layer Caching
COPY package*.json ./

# Install dependencies (inkl. devDependencies für Tailwind/PostCSS)
RUN npm ci --silent

# Copy alle notwendigen Dateien für den Build
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js postcss.config.js ./

# Build die Anwendung für Production
ENV CI=true
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.25-alpine

# Installiere curl für Healthchecks
RUN apk add --no-cache curl

# Copy build output vom build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx Konfiguration für Client-Side Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Erstelle notwendige Verzeichnisse und setze Berechtigungen
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Healthcheck hinzufügen  
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]