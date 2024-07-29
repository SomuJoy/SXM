module.exports = {
    name: 'de-care',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/apps/de-care',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
