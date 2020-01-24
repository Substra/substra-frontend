import fs from 'fs';
import util from 'util';

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

class PWAManifestPlugin {
    constructor(options, json) {
        this.options = {
            filename: 'manifest.json',
            iconsPath: __dirname,
            extension: '.png',
            ...options,
        };
        this.json = JSON.stringify(json, null, 2);
    }

    apply(compiler) {
        compiler.plugin('emit', async (compilation, cb) => {
            // create icon files
            const path = this.options.iconsPath;
            let filesPath = await readdir(path);
            filesPath = filesPath.filter((o) => o.endsWith(this.options.extension));

            const promises = filesPath.map((o) => readFile(`${path}/${o}`));

            const filesContent = await Promise.all(promises);
            filesContent.forEach((source, i) => {
                // eslint-disable-next-line no-param-reassign
                compilation.assets[filesPath[i]] = {
                    source: () => source,
                    size: () => source.length,
                };
            });

            // create manifest.json file
            // eslint-disable-next-line no-param-reassign
            compilation.assets[this.options.filename] = {
                source: () => this.json,
                size: () => this.json.length,
            };

            cb();
        });
    }
}

export default PWAManifestPlugin;
