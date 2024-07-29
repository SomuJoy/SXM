module.exports = {
    name: 'de-elements',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/apps/de-elements',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
