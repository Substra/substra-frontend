const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

const name = process.env.FRONT_AUTH_USER;
const pass = process.env.FRONT_AUTH_PASSWORD;

module.exports = {
    encryption: {
        privkey: encryption_privkey,
        fullchain: encryption_fullchain,
    },
    auth: {
        name,
        pass,
    },
};
