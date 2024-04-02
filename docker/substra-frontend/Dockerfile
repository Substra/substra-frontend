FROM node:18.20-bookworm-slim AS common

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

RUN apt-get update -y \
    && apt-get --allow-remove-essential --auto-remove remove libexpat1 libaom3 libgssapi-krb5-2 libk5crypto3 libkrb5-3 libkrb5support0 util-linux-extra util-linux mount libmount1 -y\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mv /usr/share/nginx/html/index.html /usr/share/nginx/html/index-template.html
