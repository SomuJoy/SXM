module.exports = {
    name: 'data-workflows',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/data-workflows',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
