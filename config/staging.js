const branding = process.env.FRONT_BRANDING || 'substra';

module.exports = {
    appName: branding === 'owkestra' ? 'Owkestra Staging' : 'Substra Staging',
};
