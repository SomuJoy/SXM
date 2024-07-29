module.exports = {
    name: 'shared-state-feature-flags',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/state-feature-flags',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
