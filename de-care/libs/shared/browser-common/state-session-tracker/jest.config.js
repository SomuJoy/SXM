module.exports = {
    name: 'shared-browser-common-state-session-tracker',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/shared/browser-common/state-session-tracker',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
