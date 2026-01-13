FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY src/prisma ./src/prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN npm install

COPY .env ./
COPY . .

EXPOSE 5000

CMD npx prisma generate && npx prisma migrate deploy && npm run seed && npm run dev
