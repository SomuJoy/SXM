module.exports = {
    name: 'domains-offers-state-offers',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/offers/state-offers',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
