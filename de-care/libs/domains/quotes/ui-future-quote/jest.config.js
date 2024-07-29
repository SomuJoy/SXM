module.exports = {
    name: 'domains-quotes-ui-future-quote',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/quotes/ui-future-quote',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
