import fs from 'fs';
import Source from 'raven-js/dist/raven';

class RavenPlugin {
    constructor(ravenUrl, source) {
        this.ravenUrl = ravenUrl;
        this.source = source || Source;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, cb) => {
            let source = fs.readFileSync(this.source, 'utf8');
            source += `Raven.config('${this.ravenUrl}').install();`;

            // eslint-disable-next-line no-param-reassign
            compilation.assets['raven.min.js'] = {
                source: () => source,
                size: () => source.length,
            };

            cb();
        });
    }
}

export default RavenPlugin;
