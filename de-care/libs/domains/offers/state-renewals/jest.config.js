module.exports = {
    name: 'domains-offers-state-renewals',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offers/state-renewals',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
