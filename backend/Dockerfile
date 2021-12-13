# Base image
FROM node:16-alpine as base

# Build stage
FROM base as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.d.ts ./node_modules/@types/mongoose/
COPY . .
RUN npm run build

# Final stage
FROM base
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./
RUN npm install --only=production
EXPOSE 4000
CMD ["index.js"]