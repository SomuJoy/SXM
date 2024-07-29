module.exports = {
    name: 'domains-device-ui-refresh-device',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/customer/ui-refresh-device',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
};
