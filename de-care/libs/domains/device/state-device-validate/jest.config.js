module.exports = {
  name: "domains-device-state-device-validate",
  preset: "../../../../jest.config.js",
  coverageDirectory:
    "../../../../coverage/libs/domains/device/state-device-validate",
  snapshotSerializers: [
    "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js"
  ]
};
