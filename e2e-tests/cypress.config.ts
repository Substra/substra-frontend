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
        baseUrl: 'http://substra-frontend.org-1.com:3000',
    },
    retries: {
        runMode: 2,
        openMode: 0,
    },
});
