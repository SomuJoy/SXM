module.exports = {
    name: 'shared-security',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/security',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
