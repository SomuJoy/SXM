module.exports = {
    name: 'domains-offers-storybook',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offers/storybook',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
