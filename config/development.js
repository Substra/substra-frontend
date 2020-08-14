const apiUrl = process.env.API_URL || 'http://substra-backend.node-1.com';

module.exports = {
    apps: {
        frontend: {
            apiUrl,
        },
    },
};
