module.exports = {
    name: 'domains-quotes-ui-current-quote',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/quotes/ui-current-quote',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
