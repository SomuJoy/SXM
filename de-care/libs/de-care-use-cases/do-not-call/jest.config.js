module.exports = {
    name: 'do-not-call',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/de-care-use-cases/do-not-call',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
