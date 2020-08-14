const apiPort = process.env.NODE_PORT || 3000;
const secureApiPort = process.env.SECURE_NODE_PORT || 3443;

const apiUrl = 'http://substra-backend.node-1.com';
const ravenUrl = process.env.FRONT_RAVEN_URL || '';
const encryption_privkey = './encryption/ca.key';
const encryption_fullchain = './encryption/ca.crt';

module.exports = {
    appName: 'Substra',
    apps: {
        frontend: {
            apiUrl,
            api_port: apiPort,
            secure_api_port: secureApiPort,
            baseName: {
                production: '/',
                debug: '/substra-frontend/build/ssr/client/',
            },
            meta: {
                description: 'Substra',
            },
            raven_url: ravenUrl,
            scorePrecision: 3,
        },
    },
    encryption: {
        privkey: encryption_privkey,
        fullchain: encryption_fullchain,
    },
};
