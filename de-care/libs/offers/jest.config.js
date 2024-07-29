module.exports = {
    name: 'offers',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/offers',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
