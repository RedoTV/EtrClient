FROM node:20-alpine as angular
WORKDIR /home/app
COPY package*.json .
RUN npm install -g npm@10.2.5
RUN npm ci
COPY . .
RUN npm run prod

FROM nginx:alpine
COPY --from=angular /home/app/dist/etr-client/browser /usr/share/nginx/html/etrx
COPY /default.conf  /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
EXPOSE 80