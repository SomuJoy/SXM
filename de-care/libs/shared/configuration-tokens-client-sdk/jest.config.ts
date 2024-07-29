/* eslint-disable */
export default {
    displayName: 'shared-configuration-tokens-client-sdk',
    preset: '../../../jest.preset.js',
    transform: {
        '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../coverage/libs/shared/configuration-tokens-client-sdk',
};
