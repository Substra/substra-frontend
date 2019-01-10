FROM mhart/alpine-node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY packages/ssr/package.json package.json
RUN npm install && npm cache clean --force

COPY build /usr/src/app/build
COPY webpack/ssr/client.js /usr/src/app/webpack/ssr/client.js
COPY webpack/ssr/server.js /usr/src/app/webpack/ssr/server.js
COPY webpack/ssr/vendors.js /usr/src/app/webpack/ssr/vendors.js
COPY webpack/utils /usr/src/app/webpack/utils
COPY packages/ssr/package.json /usr/src/app/packages/ssr/package.json
COPY config /usr/src/app/config
COPY .babelrc /usr/src/app/.babelrc
COPY src/app/routesMap.js /usr/src/app/src/app/routesMap.js


# setting NODE_ENV need to be AFTER npm install
ENV NODE_ENV=production \
    NODE_PORT=8000 \
    SECURE_NODE_PORT=8443 \
    REDIS_PORT=6379

EXPOSE $NODE_PORT $SECURE_NODE_PORT

CMD ["./node_modules/.bin/babel-node", "./build/ssr/index.js"]
