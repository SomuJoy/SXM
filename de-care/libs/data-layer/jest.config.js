module.exports = {
    name: 'data-layer',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/data-layer',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
