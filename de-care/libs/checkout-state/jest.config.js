module.exports = {
    name: 'checkout-state',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/checkout-state',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
