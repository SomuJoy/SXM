module.exports = {
    name: 'shared-state-behavior-events',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/state-behavior-events',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
