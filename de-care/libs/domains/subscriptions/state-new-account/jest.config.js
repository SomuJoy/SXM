module.exports = {
    name: 'domains-subscriptions-state-new-account',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/subscriptions/state-new-account',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
