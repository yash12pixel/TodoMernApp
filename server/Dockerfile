FROM node:14

WORKDIR /app

COPY package.json ./


COPY .env ./

COPY . .

RUN npm install 

EXPOSE 5000

CMD [ "node", "index.js" ]