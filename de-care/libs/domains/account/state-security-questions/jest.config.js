module.exports = {
    name: 'domains-account-state-security-questions',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/account/state-security-questions',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
