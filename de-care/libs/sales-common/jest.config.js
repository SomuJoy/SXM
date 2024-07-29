module.exports = {
    name: 'sales-common',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/sales-common',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
