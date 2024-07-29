module.exports = {
    name: 'domains-device-state-device-refresh',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/device/state-device-refresh',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
