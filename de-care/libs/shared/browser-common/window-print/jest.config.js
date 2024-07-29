module.exports = {
    name: 'shared-browser-common-window-print',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/browser-common/window-print',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
