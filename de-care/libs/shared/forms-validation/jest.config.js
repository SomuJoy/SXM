module.exports = {
    name: 'shared-forms-validation',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/forms-validation',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
