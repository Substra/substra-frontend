## Build

The `build.yaml` workflow can be triggered by:

-   pushing a commit on the `main` branch
-   pushing a tag
-   [running it manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) via the github interface or a HTTP API call

It produces "packages", which are made out of a Docker image and a Helm chart. Very basically:

-   the **Docker image** is the program itself
-   the **Helm chart** explains how to run it in a Kubernetes cluster

Packages are versioned using a script called `ci/version` which reads the version from `package.json` (any valid [SemVer 2](https://semver.org/)) but also from the given Git reference. _(there is therefore a reproducible unique version number for every commit)_

Let's say you push a commit with id `abc1234` to the `main` branch, with `package.json` set to version `0.0.1`:

-   the **Docker image** is tagged `0.0.1_abc1234`
-   the **Helm chart** is versioned `0.0.1-unstable+abc1234`
    -   `unstable` because it is provisional, until you tag it (which triggers the release process) at which point the helm chart would be re-designated `0.0.1+abc1234`
    -   however, the only thing that would change would be the _chart_ version, the _app_ version (most notably the docker image) would still be the same; that is why Helm provides us with an `appVersion` field
    -   therefore, when you push your commit, the Helm chart has fields `version: 0.0.1-version+abc1234` and `appVersion: 0.0.1+abc1234`

The current repositories are:

-   for **Docker images**, gcr.io/connect-314908 _(ie the registry for the `connect` project on GCP)_
-   for **Helm charts**, core.harbor.tooling.owkin.com/chartrepo/connect-frontend

## Release

Any commit with a Git tag pointing to it is considered a _release_.

The release workflow isn't triggered directly by pushing tags, rather they trigger the Build workflow which in turn triggers the Release workflow. It can also be triggered manually, but (at the time of writing) only via HTTP API calls since the Github interface can't allow you to run a workflow manually on a tag rather than a branch.

All the release workflow does is:

-   re-designate the approprate Helm package, removing the `unstable` prefix
-   create a Github release which is prettier than just a tag

The script that does this is `ci/issue-release`.

## PR validation (linting)

See [validate-pr.yaml](/.github/workflows/validate-pr.yaml)

## End-to-end tests

See [connect-tests](https://github.com/owkin/connect-tests)
