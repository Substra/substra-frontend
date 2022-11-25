# Substra frontend

<div align="left">
<a href="https://join.slack.com/t/substra-workspace/shared_invite/zt-1fqnk0nw6-xoPwuLJ8dAPXThfyldX8yA"><img src="https://img.shields.io/badge/chat-on%20slack-blue?logo=slack" /></a> <a href="https://docs.substra.org/"><img src="https://img.shields.io/badge/read-docs-purple?logo=mdbook" /></a>
<br /><br /></div>

<div align="center">
<picture>
  <object-position: center>
  <source media="(prefers-color-scheme: dark)" srcset="Substra-logo-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="Substra-logo-colour.svg">
  <img alt="Substra" src="Substra-logo-colour.svg" width="500">
</picture>
</div>
<br>
<br>

Substra is an open source federated learning (FL) software. It provides a flexible Python interface and a web application to run federated learning training at scale. This specific repository is about the web application - also called frontend.

## Support

If you need support, please either raise an issue on Github or ask on [Slack](https://join.slack.com/t/substra-workspace/shared_invite/zt-1fqnk0nw6-xoPwuLJ8dAPXThfyldX8yA).


## Contributing

Substra warmly welcomes any contribution. Feel free to fork the repo and create a pull request.


# Setup
## Running the frontend in a local kubernetes cluster in prod mode

1. Make sure `substra-frontend.org-1.com` and `substra-frontend.org-2.com` are pointing to the cluster's ip in your `/etc/hosts`:
   a. If you use minikube, `minikube ip` will give you the cluster's ip
   b. If you use k3s, the cluster ip is `127.0.0.1`
2. Execute `skaffold [run|dev]`. You can use the `dev` skaffold profile (via `-p dev`) to use the `dev` docker target which serves files using `vite` instead `nginx` and benefits from hot reloading inside the cluster.
3. Access the frontend at `http://substra-frontend.org-1.com`

## Running the frontend locally in dev mode

1. Make sure `substra-frontend.org-1.com` and `substra-frontend.org-2.com` are pointing to `127.0.0.1` in your `/etc/hosts`
2. Make sure you're using node 16.13.0 (`nvm install 16.13.0` and `nvm use 16.13.0`)
3. Install dependencies: `npm install --dev`
4. Run `npm run dev`
5. Access the frontend at `http://substra-frontend.org-1.com:3000`

Note: Backend is expected to be served at `http://substra-backend.org-1.com`on http port (80). In case you are using a development backend served on another url or port, you can set it using API_URL env var.
ex: `API_URL=http://127.0.0.1:8000 npm run dev`

Alternatively you can run it inside a container by using dev target.

```sh
docker build -f docker/substra-frontend/Dockerfile --target dev -t substra-frontend .
docker run -it --rm -p 3000:3000 -v ${PWD}/src:/workspace/src substra-frontend
```

Note: Use `-e API_URL=http://127.0.0.1:8000` to specify another backend URL.

## Using a specific branch / commit of the backend and/or orchestrator

Many developments done in the frontend go hand in hand with API changes coming from either the backend or the orchestrator. These changes aren't always available in the last release and sometimes aren't even merged in the `main` branches. In order to use them, you'll need to:

1. Check out the branches / commits in your local clones of the repos
2. In each repo, run `skaffold run` (with your usual options, for example `-p single-org` for `substra-backend`)

## Generic dump/restore commands

To **dump** the orchestrator DB into `orchestrator.sql`:

```sh
# Example with an 'org-1' organization and an orchestrator's postgres pod with name 'orchestrator-org-1-postgresql-0'
kubectl exec -n org-1 -i orchestrator-org-1-postgresql-0 -- pg_dump --clean --no-owner postgresql://postgres:postgres@localhost/orchestrator > orchestrator.sql
```

To **dump** the backend DB of org-1 into `backend.sql`:

```sh
# Example with an `org-1` organization and a backend's postgres pod with name `backend-org-1-postgresql-0`
kubectl exec -n org-1 -i backend-org-1-postgresql-0 -- pg_dump --clean --no-owner postgresql://postgres:postgres@localhost/substra > backend.sql
```

To **restore** the orchestrator DB from `orchestrator.sql`:

```sh
# Example with an `org-1` organization and an orchestrator's postgres pod with name `orchestrator-org-1-postgresql-0`
cat orchestrator.sql| kubectl exec -n org-1 -i orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
```

To **restore** the backend DB of org-1 from `backend.sql`:

```sh
# Example with an `org-1` organization and a backend's postgres pod with name `backend-org-1-postgresql-0`
cat backend.sql| kubectl exec -n org-1 -i backend-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/substra
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

They are written using Cypress. All E2E tests are under `e2e-tests/cypress/integration/` and end in `.spec.js`.

To install cypress, move to the `e2e-tests` folder and run `npm install`.

Then, still in this folder:

-   run these tests using `npx cypress run` or `npm run test:e2e`
-   run these tests in dev mode using `npx cypress open`

## Microsoft Clarity

In order to use microsoft clarity, you need to have a clarity ID that you can then use as such.

Locally:

```sh
MICROSOFT_CLARITY_ID=xxxxxxxxxx npm run dev
```

In production:

You'll have to define the `microsoftClarity.id` value.
