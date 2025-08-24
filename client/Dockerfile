FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
