import fetch from 'fetch-everywhere';

const encryption_privkey = '/etc/letsencrypt/live/substrafront.com/privkey.pem';
const encryption_fullchain = '/etc/letsencrypt/live/substrafront.com/fullchain.pem';

const name = process.env.FRONT_AUTH_USER;
const pass = process.env.FRONT_AUTH_PASSWORD;

// gcp public ip
const getUrl = async () => {
    const res = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip', {headers: {'Metadata-Flavor': 'Google'}});
    return res.text();
};

module.exports = (async () => {
    const ip = await getUrl();
    const apiUrl = `https://${ip}:9000`;

    return {
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
})();
