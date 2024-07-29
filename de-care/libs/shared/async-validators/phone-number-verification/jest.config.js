module.exports = {
    name: 'shared-async-validators-phone-number-verification',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/async-validators/phone-number-verification',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
