import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { svgrComponent } from 'vite-plugin-svgr-component';

import { version } from './package.json';

const APP_VERSION = process.env['APP_VERSION'] || `${version}+dev`;
const MICROSOFT_CLARITY_ID = process.env['MICROSOFT_CLARITY_ID'] || '';
const API_URL =
    process.env['API_URL'] || 'http://substra-backend.org-1.com:8000';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${APP_VERSION}'`,
        ...(process.env.NODE_ENV !== 'production'
            ? {
                  API_URL: `'${API_URL}'`,
                  MICROSOFT_CLARITY_ID: `'${MICROSOFT_CLARITY_ID}'`,
              }
            : {}),
        DEFAULT_PAGE_SIZE: '30',
        'process.env': {},
    },
    plugins: [react(), svgrComponent()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: '127.0.0.1',
    },
});
