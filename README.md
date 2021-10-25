# Connect frontend

## Running the frontend in a local kubernetes cluster in prod mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to the cluster's ip in your `/etc/hosts`:
   a. If you use minikube, `minikube ip` will give you the cluster's ip
   b. If you use k3s, the cluster ip is `127.0.0.1`
2. Run `skaffold run`
3. Access the frontend at `http://substra-frontend.node-1.com`

## Running the frontend locally in dev mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to `127.0.0.1` in your `/etc/hosts`
2. Make sure you're using node 14.17.1 (`nvm install 14.17.1` and `nvm use 14.17.1`)
3. Install dependencies: `npm install --dev`
4. Run `npm run dev`
5. Access the frontend at `http://substra-frontend.node-1.com:3000`

## Using a specific branch / commit of the backend and/or orchestrator

Many developments done in the frontend go hand in hand with API changes coming from either the backend or the orchestrator. These changes aren't always available in the last release and sometimes aren't even merged in the `master` branches. In order to use them, you'll need to:

1. Check out the branches / commits in your local clones of the repos
2. In each repo, run `skaffold run` (with your usual options, for example `-p single-org` for `connect-backend`)

## Dumping / restoring data

To **dump** the orchestrator DB into `orchestrator.sql`:

```sh
kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- pg_dump --clean --no-owner postgresql://postgres:postgres@localhost/orchestrator > orchestrator.sql
```

To **dump** the backend DB of org-1 into `connect-backend.sql`:

```sh
kubectl exec -n org-1 -i backend-org-1-postgresql-0 -- pg_dump --clean --no-owner postgresql://postgres:postgres@localhost/substra > connect-backend.sql
```

To **restore** the orchestrator DB from `orchestrator.sql`:

```sh
cat orchestrator.sql| kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
```

To **restore** the backend DB of org-1 from `connect-backend.sql`:

```sh
cat connect-backend.sql| kubectl exec -n org-1 -i backend-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/substra
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

[More info](ci/readme.md)

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
