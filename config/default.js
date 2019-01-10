const {SUBSTRABAC_USER, SUBSTRABAC_PASSWORD} = require('./credentials');

const apiPort = process.env.NODE_PORT || 3000;
const apiUrl = 'http://owkin.substrabac:8000';
const secureApiPort = process.env.SECURE_NODE_PORT || 3443;
const ravenUrl = process.env.FRONT_RAVEN_URL || '';
const encryption_privkey = './encryption/ca.key';
const encryption_fullchain = './encryption/ca.crt';
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;

module.exports = {
    appName: 'Substra Front',
    apps: {
        frontend: {
            apiUrl,
            api_port: apiPort,
            secure_api_port: secureApiPort,
            baseName: {
                production: '/',
                debug: '/substrafront/build/ssr/client/',
            },
            meta: {
                description: 'Substra Front',
                keywords: 'substra hyperledger fabric blockchain',
            },
            raven_url: ravenUrl,
        },
    },
    encryption: {
        privkey: encryption_privkey,
        fullchain: encryption_fullchain,
    },
    credentials: {
        SUBSTRABAC_USER,
        SUBSTRABAC_PASSWORD,
    },
    redis: {
        host: redis_host,
        redis: redis_port,
    },
    googleAnalytics: {
        trackerID: 'UA-130128052-1',
    },
};
