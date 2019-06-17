import path from 'path';

export default function () {
    return {
        modules: [
            path.resolve(`${__dirname}/../..`),
            'node_modules',
        ],
        alias: {
            'react-hot-loader': path.resolve(path.join(__dirname, '../../node_modules/react-hot-loader')),
            react: path.resolve(path.join(__dirname, '../../node_modules/react')),
            'react-dom': path.resolve(path.join(__dirname, '../../node_modules/react-dom')),
        },
    };
}
