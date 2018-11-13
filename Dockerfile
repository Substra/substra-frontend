FROM mhart/alpine-node:10

WORKDIR /usr/src/app

COPY packages/ssr/package.json package.json
RUN npm install && npm cache clean --force

COPY . .

# setting NODE_ENV need to be AFTER npm install
ENV NODE_ENV=production \
    NODE_PORT=8000 \
    SECURE_NODE_PORT=8443 \
    REDIS_PORT=6379

EXPOSE $NODE_PORT $SECURE_NODE_PORT

CMD ["./node_modules/.bin/babel-node", "./build/ssr/index.js"]
