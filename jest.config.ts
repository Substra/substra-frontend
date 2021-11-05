/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    roots: ['src/'],
    globals: {
        API_URL: 'http://foo.bar',
    },
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
    ],
    transform: {
        '^.+\\.tsx$': 'ts-jest',
        '^.+\\.ts$': 'ts-jest',
    },
};
