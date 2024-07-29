module.exports = {
    name: 'domains-account-ui-login-form-fields',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/account/ui-login-form-fields',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
