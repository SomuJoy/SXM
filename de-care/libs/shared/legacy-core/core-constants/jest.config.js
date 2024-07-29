module.exports = {
    name: 'shared-legacy-core-core-constants',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/legacy-core/core-constants',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
