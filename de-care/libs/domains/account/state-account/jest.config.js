module.exports = {
    name: 'domains-account-state-account',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/account/state-account',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
