# Connect frontend

## Running the frontend in a local kubernetes cluster in prod mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to the cluster's ip in your `/etc/hosts`:
   a. If you use minikube, `minikube ip` will give you the cluster's ip
   b. If you use k3s, the cluster ip is `127.0.0.1`
2. Run `skaffold run`
3. Access the frontend at `http://substra-frontend.node-1.com`

## Running the frontend locally in dev mode

1. Make sure `substra-frontend.node-1.com` and `substra-frontend.node-2.com` are pointing to `127.0.0.1` in your `/etc/hosts`
2. Make sure you're using node 16.13.0 (`nvm install 16.13.0` and `nvm use 16.13.0`)
3. Install dependencies: `npm install --dev`
4. Run `npm run dev`
5. Access the frontend at `http://substra-frontend.node-1.com:3000`

Note: Backend is expected to be served at `http://substra-backend.node-1.com`on http port (80). In case you are using a development backend served on another url or port, you can set it using API_URL env var.
ex: `API_URL=http://127.0.0.1:8000 npm run dev`

## Using a specific branch / commit of the backend and/or orchestrator

Many developments done in the frontend go hand in hand with API changes coming from either the backend or the orchestrator. These changes aren't always available in the last release and sometimes aren't even merged in the `main` branches. In order to use them, you'll need to:

1. Check out the branches / commits in your local clones of the repos
2. In each repo, run `skaffold run` (with your usual options, for example `-p single-org` for `connect-backend`)

## Using MELLODDY dumps

MELLODDY dumps are orchestrator dumps. In order to use them, you need to follow these steps.

1. Create a new k8s cluster
2. Checkout the [0.6.0 tag](https://github.com/owkin/orchestrator/releases/tag/0.6.0) on the orchestrator repo
3. Run `skaffold run --status-check=false` in the orchestrator repo
4. Once up, restore the dump (must be in sql format) with the following script:

    This script must be named located in your connect repository, at the same level as the orchestrator repository.

    It can be launched with `./restore.sh my-dump.sql`

    It will restore the dump and migrate it so that it is usable by an 0.6.0 orchestrator. It takes a fairly long time.

    ```sh
    echo "Dropping DB"
    kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost -c "REVOKE CONNECT ON DATABASE orchestrator FROM public"
    kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'orchestrator';"
    kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost -c "DROP DATABASE orchestrator"

    echo "Creating DB"
    kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost -c "CREATE DATABASE orchestrator"
    kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost -c "GRANT CONNECT ON DATABASE orchestrator TO public"

    echo "Restoring dump"
    cat $1 | kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator

    echo "Migrating db"
    cat orchestrator/server/standalone/migration/000005_add_idempotence_helpers.up.sql | kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
    cat orchestrator/server/standalone/migration/000006_improve_compute_tasks_indexes.up.sql | kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
    cat orchestrator/server/standalone/migration/000007_task_status_index.up.sql | kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
    cat orchestrator/server/standalone/migration/000008_add_compute_task_id_column_to_models.up.sql | kubectl exec -n org-1 -i owkin-orchestrator-org-1-postgresql-0 -- psql postgresql://postgres:postgres@localhost/orchestrator
    ```

5. In parallel, launch the backend from the main branch:
   `skaffold run --profile isolated --profile single-org --status-check=false`

6. Once up, clone in your connect folder the `melloddy`(https://github.com/owkin/melloddy) repo.
7. Copy in `melloddy/dockerfiles/backend-s3-importer` a gzip version of your dump. If you don't have a gzip version, you can create it by copying the dump and then running `gzip my-dump.sql`
8. Create a script in this folder names `import_orc_dump.sh` with the content:

    ```sh
    #!/usr/bin/env bash

    set -eo pipefail

    # param 1: path to the dump file
    # param 2: name of the target db to import data in (ex: substra)
    #
    # /!\ Note The postgres server URL is hardcoded in POSTGRES_URL var for now
    #     One may want to change it directly in this script
    #     To import in a cluster, one should forward db port to localhost
    #
    # /!\ precondition for this script: transform.sql fiel should be copied next to this script
    #     It may be found here: https://github.com/owkin/melloddy/blob/backend-s3-importer/dockerfiles/backend-s3-importer/transform.sql
    #     (Warning: this url will change when backend-s3-importer branch is merged. And sql script is likely to evolve)
    #
    # ex: ./import_orc_dump.sh orchestrator-20220205-1159.sql.gz substra

    POSTGRES_URL="postgresql://postgres:postgres@localhost:5432"
    DUMP_FILE="$1"
    BACKEND_DB_NAME="$2"
    TMP_BACKEND_DB="$BACKEND_DB_NAME"_tmp
    ORCHESTRATOR_SCHEMA="orchestrator"

    tmp_public_schema="public_tmp"
    orchestrator_schema="orchestrator"


    echo "Creating tmp db"
    psql "$POSTGRES_URL"/postgres <<-EOSQL
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'TMP_BACKEND_DB'
    AND pid <> pg_backend_pid();

    DROP DATABASE IF EXISTS $TMP_BACKEND_DB;
    CREATE DATABASE $TMP_BACKEND_DB;
    EOSQL

    echo "Copy in it all tables but localrep*"
    pg_dump "$POSTGRES_URL"/"$BACKEND_DB_NAME" --exclude-table-data="localrep*" | psql "$POSTGRES_URL"/"$TMP_BACKEND_DB"

    echo "Restoring orchestrator dump"
    psql "$POSTGRES_URL"/"$TMP_BACKEND_DB" <<-EOSQL
    ALTER SCHEMA public RENAME TO $tmp_public_schema;
    CREATE SCHEMA public;
    EOSQL

    # Pseudonymize pharma names while restoring data
    SED_ARG='s/OrggskMSP/pharma1/g'
    SED_ARG+='; s/OrgmerckMSP/pharma2/g'
    SED_ARG+='; s/OrgamgenMSP/pharma3/g'
    SED_ARG+='; s/OrgastellasMSP/pharma4/g'
    SED_ARG+='; s/OrgjnjMSP/pharma5/g'
    SED_ARG+='; s/OrgnovartisMSP/pharma6/g'
    SED_ARG+='; s/OrgbayerMSP/pharma7/g'
    SED_ARG+='; s/OrgbiMSP/pharma8/g'
    SED_ARG+='; s/OrgservierMSP/pharma9/g'
    SED_ARG+='; s/OrgastrazenecaMSP/pharma10/g'

    # Replace old metrics keys with new ones, so that compute plans can be compared on the same graph
    # See https://melloddy.slack.com/archives/G014K0NEM4N/p1643995416337389
    SED_ARG+='; s/2026bac5-d824-42da-833b-28c881f81100/262c12e7-6316-4b2d-8392-dd5c4173288f/g'
    SED_ARG+='; s/d8b8d778-38ab-4a6d-bbd9-845e41eb6042/c3570932-b791-41dc-b8ed-fce54faab45e/g'
    SED_ARG+='; s/caf42f34-5020-454c-bbd7-f55400bd8b36/2b6eb3b2-e546-41cc-8033-6dee56f65abe/g'
    SED_ARG+='; s/6f9e768e-6472-458b-a008-53ffb2ef1e25/b1744fd2-a22e-4653-b6d8-c051f8ebf5da/g'
    SED_ARG+='; s/9e70ce89-2384-4ee5-b944-07d26017430f/e213575c-c37b-48f7-a95e-c76f72049098/g'
    SED_ARG+='; s/98440ee7-c6f4-4433-a1ee-d99a4357b91e/8c82b012-c41e-4389-844b-d5819cebdaf4/g'
    SED_ARG+='; s/e86672d9-bd92-4069-8823-3e109f00bd97/8133ce07-6ee8-490c-9b62-3820905a769c/g'
    SED_ARG+='; s/b0c95745-98ee-4fca-9448-95c59de90bd6/fa01db1f-5c7a-4059-91f6-49628f9755d8/g'

    # Prevent index creation
    SED_ARG+='; /^CREATE INDEX/d'

    (zcat < "$DUMP_FILE") | sed -e "$SED_ARG" | psql "$POSTGRES_URL"/"$TMP_BACKEND_DB"



    psql "$POSTGRES_URL"/"$TMP_BACKEND_DB" <<-EOSQL
    ALTER SCHEMA public RENAME TO $orchestrator_schema;
    ALTER SCHEMA $tmp_public_schema RENAME TO public
    EOSQL

    echo "Transforming orchestrator data"
    psql "$POSTGRES_URL"/"$TMP_BACKEND_DB" <"transform.sql"


    echo "Removing source orchestrator data"
    psql "$POSTGRES_URL"/"$TMP_BACKEND_DB" -c "DROP SCHEMA $orchestrator_schema CASCADE"


    echo "Dropping productioncurrent db"
    psql "$POSTGRES_URL"/postgres <<-EOSQL
    REVOKE CONNECT ON DATABASE $BACKEND_DB_NAME FROM public;
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$BACKEND_DB_NAME';

    DROP DATABASE $BACKEND_DB_NAME;
    EOSQL

    # Make tmp DB the new one (by renaming it)
    echo "Rename tmp db to production db"
    psql "$POSTGRES_URL"/postgres <<-EOSQL
    REVOKE CONNECT ON DATABASE $TMP_BACKEND_DB FROM public;
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$TMP_BACKEND_DB';

    ALTER DATABASE $TMP_BACKEND_DB RENAME TO $BACKEND_DB_NAME;
    EOSQL


    echo "Done"
    ```

9. Create a port forwarding on the backend-postgresql pod (in k9s, hover over the pod, then hit shift+F and select ok)
10. Run `./import_orc_dump.sh my-dump.sql.gz substra`

You're done! Easy right?

## Generic dump/restore commands

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

## Microsoft Clarity

In order to use microsoft clarity, you need to have a clarity ID that you can then use as such.

Locally:

```sh
MICROSOFT_CLARITY_ID=xxxxxxxxxx npm run dev
```

In production:

You'll have to define the `microsoftClarity.id` value.

## MELLODDY

To run the frontend with the MELLODDY-specific devs, you have to set the MELLODDY variable env:

Locally:

```sh
MELLODDY=true npm run dev
```

In production:

You'll have to define the `melloddy` value.
