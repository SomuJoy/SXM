module.exports = {
    name: 'domains-partner-state-partner-info',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/partner/state-partner-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
