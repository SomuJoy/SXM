module.exports = {
    name: 'review-order',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/libs/review-order',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
