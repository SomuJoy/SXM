module.exports = {
    name: 'domains-customer-state-locale',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/customer/state-locale',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
