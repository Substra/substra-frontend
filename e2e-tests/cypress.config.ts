import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        USERNAME: 'org-1',
        PASSWORD: 'p@sswr0d44',
        BACKEND_API_URL: 'http://substra-backend.org-1.com:8000',
        DEFAULT_PAGE_SIZE: 30,
    },
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    defaultCommandTimeout: 20000,
    e2e: {
        setupNodeEvents(on) {
            on('task', {
                // To see log messages in the terminal during cypress run
                // cy.task("log", "my message")
                log(message) {
                    // eslint-disable-next-line no-console
                    console.log(message + '\n\n');
                    return null;
                },
            });
        },
        baseUrl: 'http://substra-frontend.org-1.com:3000',
    },
    retries: {
        runMode: 2,
        openMode: 1,
    },
});
