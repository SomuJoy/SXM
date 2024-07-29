module.exports = {
    name: 'domains-quotes-ui-quote-line-item',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/quotes/ui-quote-line-item',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
