module.exports = {
    name: 'de-streaming-onboarding-state-settings',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/de-streaming-onboarding/state-settings',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
