module.exports = {
    moduleNameMapper: {
        'react-syntax-highlighter/dist/esm/styles/prism': '<rootDir>/test/mocks/prismMock.js',
        /*
           Taken from https://jestjs.io/docs/en/webpack#handling-static-assets
           Needed for handling the font files
         */
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/mocks/fileMock.js',
        '\\.(css|less)$': '<rootDir>/test/mocks/styleMock.js',
    },
    setupFilesAfterEnv: [
        '<rootDir>/test/setup.js',
    ],
};
