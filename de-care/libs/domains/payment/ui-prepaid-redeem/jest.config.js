module.exports = {
    name: 'domains-payment-ui-prepaid-redeem',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/payment/ui-prepaid-redeem',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
