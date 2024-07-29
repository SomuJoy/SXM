module.exports = {
    name: 'sxm-ui',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/sxm-ui',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
