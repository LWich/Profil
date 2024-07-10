FROM node:14

WORKDIR /app/frontend 

ENV DEBUG=*

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "start" ]
