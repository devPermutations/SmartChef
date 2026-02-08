# Stage 1: Build native dependencies
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY recipes.json ./

RUN mkdir -p data

EXPOSE 3000

CMD ["sh", "-c", "node src/db/seed.js && node src/server.js"]
