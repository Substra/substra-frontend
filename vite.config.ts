import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import { defineConfig } from 'vite';
import { svgrComponent } from 'vite-plugin-svgr-component';
import reactJsx from 'vite-react-jsx';

import { version } from './package.json';

const APP_VERSION = process.env['APP_VERSION'] || `${version}+dev`;
const MICROSOFT_CLARITY_ID = process.env['MICROSOFT_CLARITY_ID'] || '';
const MELLODDY = process.env['MELLODDY'] || '';
const API_URL =
    process.env['API_URL'] || 'http://substra-backend.node-1.com:8000';
const HYPERPARAMETERS = process.env['HYPERPARAMETERS'] || [
    'epochs',
    'hidden_sizes',
    'last_hidden_sizes',
    'lr',
    'lr_alpha',
    'lr_steps',
    'middle_dropout',
    'last_dropout',
    'inner_batch_max',
    'input_size_freq',
    'input_transform',
    'last_non_linearity',
    'middle_non_linearity',
    'optimizer',
    'optimizer_params',
    'use_sparse',
    'use_secure_aggregation',
    'enable_cat_fusion',
    'regression_weight',
    'scaling_regularizer',
    'mixed_precision',
    'sparse_rate',
    'device',
    'predict_device',
    'enable_partner_weighting',
    'scale_partner_weighting',
    'last_hidden_sizes_reg',
    'last_hidden_sizes_class',
    'dropouts_reg',
    'dropouts_class',
    'dropouts_trunk',
    'class_feature_size',
    'regression_feature_size',
];

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: `'${APP_VERSION}'`,
        ...(process.env.NODE_ENV !== 'production'
            ? {
                  API_URL: `'${API_URL}'`,
                  MICROSOFT_CLARITY_ID: `'${MICROSOFT_CLARITY_ID}'`,
                  MELLODDY: MELLODDY === 'true',
                  HYPERPARAMETERS: HYPERPARAMETERS,
              }
            : {}),
        DEFAULT_PAGE_SIZE: '10',
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
