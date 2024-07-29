module.exports = {
    name: 'shared-browser-common-util-redirect',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/browser-common/util-redirect',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
