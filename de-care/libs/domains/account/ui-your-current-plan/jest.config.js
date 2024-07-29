module.exports = {
    name: 'domains-account-ui-your-current-plan',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/account/ui-your-current-plan',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
