module.exports = {
    name: 'shared-util-workflow-interface',
    preset: '../../../jest.config.js',
    coverageDirectory: '../../../coverage/libs/shared/util-workflow-interface',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
