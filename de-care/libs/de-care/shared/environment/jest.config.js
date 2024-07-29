module.exports = {
    name: 'de-care-shared-environment',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/de-care/shared/environment',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
