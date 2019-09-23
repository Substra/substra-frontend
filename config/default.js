const apiPort = process.env.NODE_PORT || 3000;
const secureApiPort = process.env.SECURE_NODE_PORT || 3443;

const apiUrl = 'http://owkin.substra-backend:8000';
const ravenUrl = process.env.FRONT_RAVEN_URL || '';
const encryption_privkey = './encryption/ca.key';
const encryption_fullchain = './encryption/ca.crt';
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;

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
    redis: {
        host: redis_host,
        redis: redis_port,
    },
    googleAnalytics: {
        trackerID: 'UA-130128052-1',
    },
};
