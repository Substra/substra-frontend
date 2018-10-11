module.exports = process.env.IS_ELECTRON !== 'false' ? require('./electron.js') : require('./web.js');
