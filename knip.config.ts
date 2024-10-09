import { type KnipConfig } from 'knip';

const config: KnipConfig = {
    ignore: ['e2e-tests/**'],
    // TODO: remove this line and configure in plugin when [this PR](https://github.com/webpro-nl/knip/pull/639) will be merged
    ignoreDependencies: ['jest-environment-jsdom', 'ts-node'],
    exclude: ['enumMembers'],
};

export default config;
