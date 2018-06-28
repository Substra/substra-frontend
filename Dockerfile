FROM mhart/alpine-node:8

WORKDIR /usr/src/app

COPY . .
COPY packages/ssr/package.json package.json
RUN npm install && npm cache clean --force

ARG raven_url=127.0.0.1
ARG redis_host=127.0.0.1
ARG redis_port=6379

# setting NODE_ENV need to be AFTER npm install
ENV NODE_ENV=production \
    NODE_PORT=8000 \
    SECURE_NODE_PORT=8443 \
    RAVEN_URL=$raven_url \
    REDIS_HOST=$redis_host \
    REDIS_PORT=$redis-port

EXPOSE $NODE_PORT $SECURE_NODE_PORT

CMD ["./node_modules/.bin/babel-node", "./build/ssr/index.js"]
