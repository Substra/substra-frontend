# Connect frontend

## Running the frontend in a local kubernetes cluster in prod mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to the cluster's ip (`minikube ip`) in your `/etc/hosts`
2. Run `skaffold run`
3. Access the frontend at `http://substra-frontend.node-1.com`

## Running the frontend locally in dev mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to `127.0.0.1` in your `/etc/hosts`
2. Make sure you're using node 14.17.1 (`nvm install 14.17.1` and `nvm use 14.17.1`)
3. Install dependencies: `npm install --dev`
4. Run `npm run dev`
5. Access the frontend at `http://substra-frontend.node-1.com:3000`

## Using a specific branch / commit of the backend and/or chaincode

Many developments done in the frontend go hand in hand with API changes coming from either the backend or the chaincode. These changes aren't always available in the last release and sometimes aren't even merged in the `master`/`main` branches. In order to use them, you'll need to:

### Backend

1. Check out the branch / commit in your local `connect-backend` folder
2. Run `skaffold run` (with your usual options, for example `-p single-org`) in the `connect-backend` folder

### Chaincode

1. Check out the branch / commit in your local `connect-chaincode` folder
2. Make sure there is already a minikube cluster running
3. Run `eval $(minikube -p minikube docker-env)`
4. Build the chaincode image: in the `connect-chaincode` folder, run `docker build -t substrafoundation/substra-chaincode:TAG ./`, replacing `TAG` with the tag

    For example:

    ```sh
    docker build -t substrafoundation/substra-chaincode:update-date ./
    ```

5. In the `connect-hlf-k8s` folder, replace the `tag` value of the `substrafoundation/substra-chaincode` image entries in the value files that match you deployment.

    For 1 and 2 orgs setup, this means updating the files:

    - `examples/2-orgs-policy-any-no-ca/values/org-1-peer-1.yaml`
    - `examples/2-orgs-policy-any-no-ca/values/org-2-peer-1.yaml`
    - `examples/2-orgs-policy-any/values/org-1-peer-1.yaml`
    - `examples/2-orgs-policy-any/values/org-2-peer-1.yaml`

    Example for the update:

    ```diff
    diff --git a/examples/2-orgs-policy-any-no-ca/values/org-1-peer-1.yaml b/examples/2-orgs-policy-any-no-ca/values/org-1-peer-1.yaml
    index b11635f..298ca60 100644
    --- a/examples/2-orgs-policy-any-no-ca/values/org-1-peer-1.yaml
    +++ b/examples/2-orgs-policy-any-no-ca/values/org-1-peer-1.yaml
    @@ -30,7 +30,7 @@ chaincodes:
         version: "1.0"
         image:
           repository: substrafoundation/substra-chaincode
    -      tag: 0.3.0
    +      tag: update-date
           pullPolicy: IfNotPresent
       - name: yourcc
         address: network-org-1-peer-1-hlf-k8s-chaincode-yourcc.org-1.svc.cluster.local
    ```

## Development setup

### Git hooks

Run `npm run prepare` to install git hooks that will format code using prettier.

### VSCode plugins

Since we're using emotion for CSS in JS, you should install the [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components) plugin. It provides intellisense and syntax highlighting for styled components.

## Authentication

When logging in, the backend will set 3 cookies:

-   `refresh` (httpOnly)
-   `signature` (httpOnly)
-   `header.payload`

In order to fetch data, you then have to send back both `refresh` and `signature` as cookies (automatically handled by the browser) and `header.payload` in an `Authorization` header with the `JWT` prefix.

E.g. `Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIxNjY5MDQ3LCJqdGkiOiJiYzAzNjU1NTJkNzc0ZmJjYTBmYmUwOTQ5Y2QwMGVhZiIsInVzZXJfaWQiOjF9`

## CI

The CI will build all commits on the `main` branch as "unstable" builds, with the version from `package.json`.
Builds are a Docker image + a Helm chart.

Tagged commits will be made into full release (not marked as "unstable" and with a GitHub release).
Typically, `git tag 1.2.3 && git push origin 1.2.3` should be enough.

## Tests

### Unit tests

They are written using Jest in files ending in `.test.ts`. These files live next to the module / component they test.

To run these tests:

```sh
npx vite-dev
```

or using our alias:

```sh
npm run test:unit
```

### E2E tests

They are written using Cypress. All E2E tests are under `cypress/integration/` and end in `.spec.js`.

To run these tests:

```sh
npx cypress run
```

or using our alias:

```sh
npm run test:e2e
```

To run these tests in dev mode:

```sh
npx cypress open
```
