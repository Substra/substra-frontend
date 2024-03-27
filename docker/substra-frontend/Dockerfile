FROM node:18.19.1-alpine3.19 AS common

ARG APP_VERSION

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm install --unsafe-perm


FROM common as dev

COPY src public index.html vite.config.ts tsconfig.json ./
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000" ]


FROM common as build

COPY . .
ENV NODE_ENV=production
RUN npm run build


FROM nginx:1.25.4

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

RUN mv /usr/share/nginx/html/index.html /usr/share/nginx/html/index-template.html
