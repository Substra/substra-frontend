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

If you're using a backend deployed to k8s, make sure to include `substra-frontend.node-1.com:3000` in the CORS_ORIGIN_WHITELIST. If you're using skaffold to deploy the backend, apply the following diff to the backend's skaffold.yaml:

```diff
diff --git a/skaffold.yaml b/skaffold.yaml
index 8ee9a09a..5e777a1d 100644
--- a/skaffold.yaml
+++ b/skaffold.yaml
@@ -150,7 +150,7 @@ deploy:
           extraEnv:
             # Should be a json list
             - name: CORS_ORIGIN_WHITELIST
-              value: '["http://substra-frontend.node-1.com/"]'
+              value: '["http://substra-frontend.node-1.com:3001/"]'
             - name: CORS_ALLOW_CREDENTIALS
               value: "true"
             - name: DEFAULT_THROTTLE_RATES
@@ -203,7 +203,7 @@ deploy:
           extraEnv:
             # Should be a json list
             - name: CORS_ORIGIN_WHITELIST
-              value: '["http://substra-frontend.node-2.com/"]'
+              value: '["http://substra-frontend.node-2.com:3001/"]'
             - name: CORS_ALLOW_CREDENTIALS
               value: "true"
             - name: DEFAULT_THROTTLE_RATES
```

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

## Generate static for github pages

Simply run `npm run static` for generating a `static` folder and an `index.html` file a the root of the project.

You can also run `npm run static-debug` for debugging it in localhost with Webstorm.

## Test and Cover

For running the test suite:
`yarn test`

For displaying covering:
`yarn cover`

If you are using Webstorm, you can use the jest configuration for easily debugging your tests with breakpoints:
![](jest.png)

## Eslint

For displaying lint errors:
`yarn eslint`

## Encryption files creation

For creating your own self signed certificates

https://blog.didierstevens.com/2008/12/30/howto-make-your-own-cert-with-openssl/
```shell
cd encryption
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 1826 -key ca.key -out ca.crt
openssl genrsa -out ia.key 4096
openssl req -new -key ia.key -out ia.csr
openssl x509 -req -days 730 -in ia.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out ia.crt
```


#### With let's encrypt

##### Dev mode

```shell
sudo certbot certonly --manual -d substraFoudation.github.io -d www.substraFoudation.github.io
```

Places the files in the folder `./well-known/acme-challenge` and build and deploy your website, then continue the process for validating the ownership of the website.
Then places the generated files to the `encryption` folder.

The certificates will only last for 90 days, so be sure to create a cronjob with the command
```shell
sudo certbot renew
```
for issuing new certificates and rebuild and deploy your docker app.

## Debugging with JetBrains editors

In order to debug your code within a JetBrains editor you'll need to:

1. Run your code in dev mode,
2. Setup a "Javascript debug" configuration in the editor. Use the URL at which your dev server is accessible for the URL field,
3. Run this new configuration in debug mode.
4. You're done!

This will open a new browser window that will respond to your breakpoints.

*Taken from https://blog.jetbrains.com/webstorm/2017/01/debugging-react-apps/*
