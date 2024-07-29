module.exports = {
    name: 'shared-browser-common-intersection-observer',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/browser-common/intersection-observer',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
