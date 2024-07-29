module.exports = {
    name: 'domains-customer-ui-verify-address',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/customer/ui-verify-address',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
