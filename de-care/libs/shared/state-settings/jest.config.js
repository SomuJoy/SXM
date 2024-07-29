module.exports = {
    name: 'shared-state-settings',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/state-settings',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
