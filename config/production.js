const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

module.exports = {
    encryption: {
        privkey: encryption_privkey,
        fullchain: encryption_fullchain,
    },
};
