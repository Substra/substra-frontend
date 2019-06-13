module.exports = {
    setupFilesAfterEnv: [
        '@testing-library/react/cleanup-after-each',
        '<rootDir>/test/setup.js',
    ]
};
