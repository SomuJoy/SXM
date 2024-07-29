module.exports = {
    name: 'shared-storybook-util-helpers',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/storybook/util-helpers',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
