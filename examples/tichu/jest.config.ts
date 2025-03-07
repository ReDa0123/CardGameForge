import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
        '^cardgameforge/(.*)$': '<rootDir>/../../src/$1',
    },
    testMatch: ['**/*.test.ts'],
    verbose: true,
};

export default config;
