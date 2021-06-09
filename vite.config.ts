import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactSvgPlugin from 'vite-plugin-react-svg';
import { execSync } from 'child_process';
import { version } from './package.json';
import path from 'path';

const output = execSync('git rev-parse --short HEAD');
const GIT_COMMIT = output.toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${version} - ${GIT_COMMIT}'`,
    },
    plugins: [
        reactRefresh(),
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
