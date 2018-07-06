module.exports = process.env.NODE_ENV === 'production' || process.env.IS_STATIC === 'true'
        ? null
        : require('./dev.js');
