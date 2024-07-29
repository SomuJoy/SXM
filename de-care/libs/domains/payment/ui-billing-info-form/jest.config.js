module.exports = {
    name: 'domains-payment-ui-billing-info-form',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/payment/ui-billing-info-form',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
