export const stubDeviceValidateNewSuccess = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/new-success.json` });
};

export const stubDeviceValidateUsedSuccess = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/used-success.json` });
};

export const stubDeviceValidateTrialActivationOrganicSuccess = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/trial-activation-organic-success.json` });
};

export const stubDeviceValidateInvalidVin = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/invalid-vin.json`, statusCode: 400 });
};

export const stubDeviceValidateNotFound = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/not-found.json`, statusCode: 400 });
};

export const stubDeviceValidateRadioIdNotFound = () => {
    cy.intercept('POST', '**/services/device/validate', { fixture: `de-microservices/device/validate/radio-id-not-found.json`, statusCode: 400 });
};

export const stubDeviceInfoNewNoVehicleSuccess = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: `de-microservices/device/info/new-no-vehicle.json` });
};

export const stubDeviceInfoNewWithVehicleSuccess = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: `de-microservices/device/info/new-with-vehicle.json` });
};

export const stubDeviceRefreshSuccess = () => {
    cy.intercept('POST', '**/services/device/refresh', { fixture: `de-microservices/device/refresh/success.json` });
};

export const stubDeviceTokenSuccess = () => {
    cy.intercept('POST', '**/services/device/token', { fixture: 'de-microservices/device/token/success.json' });
};

export const stubDeviceInfoNewNotInUseWithVehicleAndVin = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: `de-microservices/device/info/new-not-in-use-with-vehicle-and-vin.json` });
};

export const stubDeviceInfoOneStepTrialActivation = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: `de-microservices/device/info/one-step-trial-activation-device-info.json` });
};

export const stubDeviceInfoTrialActivationOrganicDeviceNotUsed = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: `de-microservices/device/info/trial-activation-orgnanic-device-info.json` });
};
