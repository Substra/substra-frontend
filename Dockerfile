FROM node:alpine AS build

WORKDIR /workspace

COPY package-build.json /workspace/package.json
COPY packages/ssr /workspace/packages/ssr
COPY packages/base /workspace/packages/base
COPY packages/plugins  /workspace/packages/plugins

RUN yarn install

COPY . /workspace/

ARG FRONT_BRANDING

# NODE_ENV production need to be after yarn install, otherwise devdependencies are not installed
ENV FRONT_BRANDING=${FRONT_BRANDING} \
    NODE_ENV=production

RUN yarn build:main

FROM node:alpine

WORKDIR /workspace

COPY --from=build /workspace/packages/ssr/package.json /workspace/package.json

RUN yarn install

# NODE_ENV production need to be after yarn install, otherwise devdependencies are not installed
ENV NODE_ENV=production

COPY --from=build /workspace/build /workspace/build
COPY --from=build /workspace/config /workspace/config
COPY --from=build /workspace/.babelrc /workspace/.babelrc
COPY --from=build /workspace/webpack /workspace/webpack
COPY --from=build /workspace/src/app/routesMap.js /workspace/src/app/routesMap.js

CMD ["./node_modules/.bin/babel-node", "./build/ssr/index.js"]
