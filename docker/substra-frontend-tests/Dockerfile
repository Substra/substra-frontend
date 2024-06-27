FROM cypress/included:13.12.0

RUN yarn add typescript@5.5.2

WORKDIR /e2e

COPY /e2e-tests/cypress /e2e/cypress
COPY /e2e-tests/cypress.config.ts /e2e/cypress.config.ts
#ENV DEBUG="cypress:*"