module.exports = {
    name: 'domains-account-ui-account-and-subscriptions-info',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/account/ui-account-and-subscriptions-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
