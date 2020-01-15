FROM node:13.6.0-alpine3.10 as node
WORKDIR /usr/src/app

COPY package*.json ./

ENV PATH="node_modules/.bin:$PATH"

RUN apk update

RUN apk add git python cmake make gcc g++

RUN npm install

COPY . /usr/src/app

EXPOSE 4200

CMD ng serve --host 0.0.0.0
