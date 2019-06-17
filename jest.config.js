module.exports = {
    moduleNameMapper: {
        'react-syntax-highlighter/dist/esm/styles/prism': '<rootDir>/test/mocks/prismMock.js',
    },
    setupFilesAfterEnv: [
        '@testing-library/react/cleanup-after-each',
        '<rootDir>/test/setup.js',
    ],
};
