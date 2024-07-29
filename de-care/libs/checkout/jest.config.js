module.exports = {
    name: 'checkout',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/checkout',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
