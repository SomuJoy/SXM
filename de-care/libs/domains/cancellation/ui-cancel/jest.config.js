module.exports = {
    name: 'domains-cancellation-ui-cancel',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/cancellation/ui-cancel',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
