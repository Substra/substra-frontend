const apiUrl = process.env.API_URL || 'http://substra-backend.owkin.xyz:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
