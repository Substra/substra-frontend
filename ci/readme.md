## Version

Packages are versioned using a Python script called `ci/version` which reads the version from:

-   `package.json` for the app version
-   `charts/connect-frontend/Chart.yaml` for the Helm chart version

The `--insert-dev-info` option will also add info from the current commit, which is used to create "continuous" packages.

Example usage:

```sh
python3 -m pip install -r ci/cilib/requirements.txt
ci/version app --insert-dev-info
```

## Build

Docker images (containing the app) are built by `ci/publish-docker`, and Helm charts by `ci/publish-helm`.

On the CI, they are built continuously by GitHub Actions workflow called [build.yaml](/.github/workflows/build.yaml), which gives them "dev" versions based on commit info. This workflow can be triggered by:

-   pushing a commit on the `main` branch
-   pushing a tag
-   [running it manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) via the github interface or a HTTP API call

The registry is `gcr.io/connect-314908` _(ie the registry for the `connect` project on GCP)_

The helm chart repository is `core.harbor.tooling.owkin.com/chartrepo/connect-frontend`.

## Release

### App (docker images)

When a tag is pushed, it triggers the [release.yaml](/.github/workflows/release.yaml) workflow, which builds an images with the same tag.

### Helm

Helm charts do not follow the regular release process. Any change to the `charts/` directory to the main branch will trigger a build and upload.

## PR validation (linting)

See [validate-pr.yaml](/.github/workflows/validate-pr.yaml)

## End-to-end tests

End-to-end tests are hosted here, but the CI that runs them is on [substra-tests](https://github.com/Substra/substra-tests)
