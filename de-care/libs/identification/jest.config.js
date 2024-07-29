module.exports = {
    name: 'identification',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/identification',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
