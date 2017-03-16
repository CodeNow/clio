FROM node:4.8.0

ADD ./package.json /app/package.json
WORKDIR /app

RUN npm install
ADD . /app

EXPOSE 8001

CMD npm start
