# Patched packages

WARNING: in order for the patch-package command to run at postinstall, we need to run `npm install` with the `--unsafe-perm` flag. See https://github.com/npm/npm-lifecycle/issues/49 for more details.

## mdast-util-to-hast

We ran into this specific issue: https://github.com/vitejs/vite/issues/3592

TL;DR react-markdown 6.0.2 crashed in production mode because one of its deps has a circular import.

The faulty package is a dependance of a dependance of one our dependencies. In order to have it in the right version we'd have to update lots of packages and this caused a lot of trouble.

The easy solution was therefore to patch the dependency to remove the circular import (done in a later version of the package).
