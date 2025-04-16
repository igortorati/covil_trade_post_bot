FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 
RUN npm run build

FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]