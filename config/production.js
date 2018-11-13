const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

const name = process.env.FRONT_AUTH_USER;
const pass = process.env.FRONT_AUTH_PASSWORD;

const site_host = process.env.SITE_HOST;
const back_port = process.env.BACK_PORT;

const apiUrl = `https://${site_host}:${back_port}`;

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
    encryption: {
        privkey: encryption_privkey,
        fullchain: encryption_fullchain,
    },
    auth: {
        name,
        pass,
    },
};
