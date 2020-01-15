### STAGE 1: Build ###
FROM node:10.18.1-alpine as build
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add git
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/my-app /usr/share/nginx/html


#FROM nginx:1.17.1-alpine
#COPY /dist/my-app /usr/share/nginx/html
