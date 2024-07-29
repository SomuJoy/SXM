module.exports = {
    name: 'shared-de-microservices-common',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/de-microservices-common',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
