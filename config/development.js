const apiUrl = process.env.API_URL || 'http://owkin.substrabac:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
