module.exports = {
    name: 'offer-upsell',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/offer-upsell',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
