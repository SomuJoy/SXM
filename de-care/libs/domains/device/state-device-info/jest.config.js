module.exports = {
    name: 'domains-device-state-device-info',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/device/state-device-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
