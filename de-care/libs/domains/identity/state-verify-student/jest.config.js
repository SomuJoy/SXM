module.exports = {
    name: 'domains-identity-state-verify-student',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/identity/state-verify-student',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
