FROM cypress/included:7.6.0

RUN mkdir /e2e
COPY /e2e-tests/cypress /e2e/cypress
COPY /e2e-tests/cypress.json /e2e/cypress.json
#ENV DEBUG="cypress:*"