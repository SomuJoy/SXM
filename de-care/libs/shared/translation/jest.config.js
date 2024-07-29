module.exports = {
    name: 'shared-translation',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/translation',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
