FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3500

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
