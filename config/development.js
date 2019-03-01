const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
