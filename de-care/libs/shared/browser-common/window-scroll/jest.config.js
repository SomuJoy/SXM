module.exports = {
    name: 'shared-browser-common-window-scroll',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/browser-common/window-scroll',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
};
