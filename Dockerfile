FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . . 
RUN npm run build

FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

STOPSIGNAL SIGTERM

ARG PORT
EXPOSE ${PORT:-8000}

CMD ["node", "dist/index.js"]