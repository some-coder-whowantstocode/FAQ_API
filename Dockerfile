FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9310

ENV PORT=9310
ENV MONGO_URI=mongodb://mongodb:27017/translate
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

CMD ["node", "src/index.js"]
