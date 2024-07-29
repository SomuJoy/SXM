module.exports = {
    name: 'domains-payment-state-gift-card',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/payment/state-gift-card',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
