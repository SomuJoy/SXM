module.exports = {
    name: 'de-streaming-onboarding-feature-get-started',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/de-streaming-onboarding/feature-get-started',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
