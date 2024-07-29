module.exports = {
    name: 'de-streaming-onboarding',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/apps/de-streaming-onboarding',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
