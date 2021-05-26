# Connect frontend

## Running the frontend in a local kubernetes cluster in prod mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to the cluster's ip (`minikube ip`) in your `/etc/hosts`
2. Run `skaffold run`
3. Access the frontend at `http://substra-frontend.node-1.com`

## Running the frontend locally in dev mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to `127.0.0.1` in your `/etc/hosts`
2. Make sure you're using node 14.14.0 (`nvm install 14.14.0` and `nvm use 14.14.0`)
3. Install dependencies: `npm install --dev`
4. Run `npm run dev`
5. Access the frontend at `http://substra-frontend.node-1.com:3000`

## Development setup

### Git hooks

Run `npm run prepare` to install git hooks that will format code using prettier.
