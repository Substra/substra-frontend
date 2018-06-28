import path from 'path';

export default function () {
    return {
        modules: [
            path.resolve(`${__dirname}/../..`),
            'node_modules',
        ],
    };
}
