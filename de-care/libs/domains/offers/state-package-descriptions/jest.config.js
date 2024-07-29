module.exports = {
    name: 'domains-offers-state-package-descriptions',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offers/state-package-descriptions',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
