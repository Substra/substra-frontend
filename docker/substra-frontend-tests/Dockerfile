FROM cypress/included:12.12.0

RUN mkdir /e2e
COPY /e2e-tests/cypress /e2e/cypress
COPY /e2e-tests/cypress.config.js /e2e/cypress.config.js
#ENV DEBUG="cypress:*"