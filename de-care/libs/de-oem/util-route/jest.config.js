module.exports = {
    name: 'de-oem-util-route',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/de-oem/util-route',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
