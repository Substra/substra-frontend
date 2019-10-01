const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

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
};
