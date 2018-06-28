// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
module.exports = process.env.NODE_ENV === 'production' ?
    require('./prod.js') :
    require('./dev.js');
