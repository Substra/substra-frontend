FROM cypress/included:12.12.0

RUN yarn add typescript@4.4.4

WORKDIR /e2e

COPY /e2e-tests/cypress /e2e/cypress
COPY /e2e-tests/cypress.config.ts /e2e/cypress.config.ts
#ENV DEBUG="cypress:*"