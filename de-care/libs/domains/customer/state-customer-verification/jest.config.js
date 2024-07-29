module.exports = {
    name: 'domains-customer-state-customer-verification',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/customer/state-customer-verification',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
