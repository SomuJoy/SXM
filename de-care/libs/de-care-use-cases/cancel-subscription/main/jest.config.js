module.exports = {
    name: 'de-care-use-cases-cancel-subscription-main',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/de-care-use-cases/cancel-subscription/main',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};