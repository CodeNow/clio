FROM node:6.10.0

ADD ./package.json /app/package.json
WORKDIR /app

RUN npm install
ADD . /app

CMD npm start
