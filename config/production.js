const encryption_privkey = '/etc/letsencrypt/live/substra-frontend.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substra-frontend.com/fullchain.pem';

const name = process.env.FRONT_AUTH_USER;
const pass = process.env.FRONT_AUTH_PASSWORD;

const apiUrl = process.env.API_URL;

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
