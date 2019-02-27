const name = process.env.FRONT_AUTH_USER;
const pass = process.env.FRONT_AUTH_PASSWORD;

const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
    auth: {
        name,
        pass,
    },
};
