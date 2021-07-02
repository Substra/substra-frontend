FROM node:14.17.1-alpine AS build

WORKDIR /workspace

COPY package.json .
RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:latest

COPY --from=build /workspace/dist /usr/share/nginx/html
