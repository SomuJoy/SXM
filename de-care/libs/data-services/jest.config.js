module.exports = {
    name: 'data-services',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/data-services',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};