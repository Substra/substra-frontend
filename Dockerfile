FROM node:14.17.1-alpine AS build

ARG APP_VERSION

WORKDIR /workspace

COPY package.json .
RUN npm install --unsafe-perm

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/index-template.html
