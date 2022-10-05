import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
import { svgrComponent } from 'vite-plugin-svgr-component';
import reactJsx from 'vite-react-jsx';

import { version } from './package.json';

const APP_VERSION = process.env['APP_VERSION'] || `${version}+dev`;
const MICROSOFT_CLARITY_ID = process.env['MICROSOFT_CLARITY_ID'] || '';
const GOOGLE_ANALYTICS_ID = process.env['GOOGLE_ANALYTICS_ID'] || '';
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
                  GOOGLE_ANALYTICS_ID: `'${GOOGLE_ANALYTICS_ID}'`,
              }
            : {}),
        DEFAULT_PAGE_SIZE: '30',
        'process.env': {},
    },
    plugins: [
        reactJsx(),
        // Do not include reactRefresh in test mode
        ...(process.env.NODE_ENV === 'test' ? [] : [reactRefresh()]),
        svgrComponent(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
