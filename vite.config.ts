import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactSvgPlugin from 'vite-plugin-react-svg';
import reactJsx from 'vite-react-jsx';
import { version } from './package.json';
import path from 'path';

// TODO: inject this env variable automatically at build
const GIT_COMMIT = process.env['GIT_COMMIT'];

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${version} - ${GIT_COMMIT}'`,
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
