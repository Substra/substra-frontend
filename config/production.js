const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

const name = process.env.SUBSTRA_FRONT_USERNAME || 'owkestra';
const pass = process.env.SUBSTRA_FRONT_PWD || 'pwd';

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
