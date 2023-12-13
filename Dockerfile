FROM node:20-alpine as angular
WORKDIR /home/app
COPY package*.json .
RUN npm install -g npm@10.2.5
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=angular /home/app/dist/etr-client/browser .
EXPOSE 80