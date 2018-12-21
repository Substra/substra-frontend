import fs from 'fs';
import path from 'path';

class RavenPlugin {
    constructor(ravenUrl, source = path.resolve(__dirname, '../../../../node_modules/raven-js/dist/raven.js')) {
        this.ravenUrl = ravenUrl;
        this.source = source;
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
