# Substra Frontend

## Installation

This project is guaranteed to work with Node.JS version `12.16.1 LTS` but should also work with newer versions.

It uses yarn and the experimental yarn workspaces for package.json splitting and convenience.

Please install the last version of yarn and run:<br/>
`yarn config set workspaces-experimental true`

Then run:<br/>
`yarn install`

For testing and developing on the project with true hot module replacement, run
`yarn start`
Then head to `http://substra-frontend.node-1.com:3000/` `substra-backend.node-1.com` is important for working with same site cookie policy. 

For testing with prod config:<br/>
`yarn start:prod`

For building the production website, run:
```
yarn build:main
```

## Storybook

We use [Storybook](https://storybook.js.org/) for component development and testing:

```sh
$ yarn storybook
```

## Test and Cover

For running the test suite:
`yarn test`

For displaying covering:
`yarn cover`

## Eslint

For auto-fixing linting errors:
`yarn eslint`
