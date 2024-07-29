module.exports = {
    name: 'domains-cancellation-state-cancellation',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/cancellation/state-cancellation',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
