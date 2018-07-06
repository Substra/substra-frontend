module.exports = process.env.NODE_ENV === 'production' ? require('./prod.js') : require('./dev.js');
