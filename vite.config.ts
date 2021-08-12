import { version } from './package.json';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
import reactSvgPlugin from 'vite-plugin-react-svg';
import reactJsx from 'vite-react-jsx';

// TODO: inject this env variable automatically at build
const GIT_COMMIT = process.env['GIT_COMMIT'];

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${version} - ${GIT_COMMIT}'`,
        ...(process.env.NODE_ENV !== 'production'
            ? { API_URL: `'http://substra-backend.node-1.com'` }
            : {}),
        PAGE_SIZE: '10',
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
