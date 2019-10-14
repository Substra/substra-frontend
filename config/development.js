const apiUrl = process.env.API_URL || 'http://substrabac.owkin.xyz:8000';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
