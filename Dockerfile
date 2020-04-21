FROM node:12.16.1-alpine AS build

RUN apk add python2 make g++

WORKDIR /workspace

COPY package.json /workspace/package.json
COPY packages/ssr /workspace/packages/ssr
COPY packages/base /workspace/packages/base
COPY packages/plugins  /workspace/packages/plugins
COPY .yarnrc /workspace
COPY yarn.lock  /workspace

RUN yarn config list
RUN yarn install

COPY . /workspace/

# NODE_ENV production need to be after yarn install, otherwise devdependencies are not installed
ENV NODE_ENV=production

RUN yarn build:main

FROM node:12.16.1-alpine

WORKDIR /workspace

COPY --from=build /workspace/package.json /workspace/package.json
COPY --from=build /workspace/packages/ssr /workspace/packages/ssr
COPY --from=build /workspace/.yarnrc /workspace/.yarnrc
COPY --from=build /workspace/yarn.lock /workspace/yarn.lock

RUN yarn install

# NODE_ENV production need to be after yarn install, otherwise devdependencies are not installed
ENV NODE_ENV=production

COPY --from=build /workspace/build /workspace/build
COPY --from=build /workspace/config /workspace/config
COPY --from=build /workspace/.babelrc /workspace/.babelrc
COPY --from=build /workspace/webpack /workspace/webpack
COPY --from=build /workspace/src/app/routesMap.js /workspace/src/app/routesMap.js

CMD ["./node_modules/.bin/babel-node", "./build/ssr/index.js"]
