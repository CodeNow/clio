FROM node:4.8.0

ADD ./package.json /app/package.json
WORKDIR /app

RUN npm install
ADD . /app

EXPOSE Changed default port to 8008

CMD npm start
