import { version } from './package.json';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
import reactSvgPlugin from 'vite-plugin-react-svg';
import reactJsx from 'vite-react-jsx';

const APP_VERSION = process.env['APP_VERSION'] || `${version}+dev`;

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${APP_VERSION}'`,
        ...(process.env.NODE_ENV !== 'production'
            ? { API_URL: `'http://substra-backend.node-1.com'` }
            : {}),
        DEFAULT_PAGE_SIZE: '10',
        'process.env': {},
    },
    plugins: [
        reactJsx(),
        // Do not include reactRefresh in test mode
        ...(process.env.NODE_ENV === 'test' ? [] : [reactRefresh()]),
        reactSvgPlugin({
            defaultExport: 'component',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
