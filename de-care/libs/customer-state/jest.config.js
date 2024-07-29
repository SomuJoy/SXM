module.exports = {
    name: 'customer-state',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/customer-state',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
