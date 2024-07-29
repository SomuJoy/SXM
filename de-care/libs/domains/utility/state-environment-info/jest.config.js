module.exports = {
    name: 'domains-utility-state-environment-info',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/utility/state-environment-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
