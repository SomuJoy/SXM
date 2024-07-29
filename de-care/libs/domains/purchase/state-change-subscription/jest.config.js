module.exports = {
    name: 'domains-purchase-state-change-subscription',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/purchase/state-change-subscription',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
