module.exports = {
    name: 'domains-quotes-ui-order-summary',
    preset: '../../../../jest.config.js',
    coverageDirectory: '../../../../coverage/libs/domains/quotes/ui-order-summary',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js'
    ]
};
