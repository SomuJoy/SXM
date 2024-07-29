module.exports = {
    name: 'de-care-use-cases-checkout-state-checkout-triage',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/de-care-use-cases/checkout/state-checkout-triage',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
