module.exports = {
    name: 'domains-vehicle-ui-vehicle-info',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/vehicle/ui-vehicle-info',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
