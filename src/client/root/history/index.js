module.exports = process.env.IS_ELECTRON !== 'false' ?
    require('./electron.js') : (process.env.NODE_ENV === 'production' ?
        require('./prod.js') :
        require('./dev.js'));
