module.exports = {
    name: 'domains-quotes-state-quote',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/quotes/state-quote',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
