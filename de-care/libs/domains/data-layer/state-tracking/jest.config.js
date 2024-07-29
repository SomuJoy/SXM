module.exports = {
    name: 'domains-data-layer-state-tracking',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/data-layer/state-tracking',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
