module.exports = {
    name: 'de-care-use-cases-trial-activation-ui-partner-shell',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/de-care-use-cases/trial-activation/ui-partner-shell',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
