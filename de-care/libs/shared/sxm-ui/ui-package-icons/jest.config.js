module.exports = {
    name: 'shared-sxm-ui-ui-package-icons',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/sxm-ui/ui-package-icons',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
