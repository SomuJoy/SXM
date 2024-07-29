module.exports = {
    name: 'customer-info',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/customer-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
