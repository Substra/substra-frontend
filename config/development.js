const apiUrl = process.env.API_URL || 'http://substrabac.owkin.com:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
