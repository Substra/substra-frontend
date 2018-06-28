class AddAssetPlugin {
    constructor(filePath, source) {
        this.filePath = filePath;
        this.source = source;
    }
    apply(compiler) {
        compiler.plugin('emit', async (compilation, cb) => {
            const source = typeof this.source === 'string' ? this.source : await this.source(compilation);

            // eslint-disable-next-line no-param-reassign
            compilation.assets[this.filePath] = {
                source: () => source,
                size: () => source.length,
            };

            cb();
        });
    }
}

export default AddAssetPlugin;
