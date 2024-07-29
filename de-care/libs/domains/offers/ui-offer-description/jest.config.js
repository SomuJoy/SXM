module.exports = {
    name: 'domains-offer-ui-offer-description',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offer/ui-offer-description',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
