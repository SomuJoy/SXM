module.exports = {
    name: 'domains-offers-ui-offer-details-wrapper',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offers/ui-offer-details-wrapper',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};