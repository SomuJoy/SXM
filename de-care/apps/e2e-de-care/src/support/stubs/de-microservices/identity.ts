export const identityCustomerCredentialRecoverySuccess = () => {
    cy.intercept('POST', '**/services/identity/customer/credentials-recovery', { fixture: 'de-microservices/identity/customer/credentials-recovery/success.json' });
};

export const identityCustomerCredentialRecoveryForNoAccount = () => {
    cy.intercept('POST', '**/services/identity/customer/credentials-recovery', {
        fixture: 'de-microservices/identity/customer/credentials-recovery/no-account.json',
    });
};

export const stubIdentityCustomerEmailSuccess = () => {
    cy.intercept('POST', '**/services/identity/customer/email', { fixture: 'de-microservices/identity/customer/email/success.json' });
};

export const stubIdentityCustomerEmailStreamingCommonExistingSingleStreaming = () => {
    cy.intercept('POST', '**/services/identity/customer/email', { fixture: 'de-microservices/identity/customer/email/streaming-common_existing-single-streaming.json' });
};

export const stubIdentityCustomerEmailStreamingCommonExistingMultipleStreaming = () => {
    cy.intercept('POST', '**/services/identity/customer/email', { fixture: 'de-microservices/identity/customer/email/streaming-common_existing-multiple-streaming.json' });
};

export const stubIdentityCustomerEmailStreamingCommonExistingSingleTrial = () => {
    cy.intercept('POST', '**/services/identity/customer/email', { fixture: 'de-microservices/identity/customer/email/streaming-common_existing-single-trial.json' });
};

export const stubIdentityCustomEmailStreamingCommonExistingMultipleWithAndWithoutFollowOn = () => {
    cy.intercept('POST', '**/services/identity/customer/email', {
        fixture: 'de-microservices/identity/customer/email/streaming-common_existing-multiple-with-and-without-followon.json',
    });
};

export const stubIdentityCustomerFlepzNoResults = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/no-results.json' });
};

export const stubIdentityCustomerFlepzActiveAccountWithClosedSubscription = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/account-with-closed-subscription.json' });
};

export const stubIdentityCustomerFlepzTwoClosedRadios = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/two-closed-radios.json' });
};

export const stubIdentityCustomerFlepzTwoClosedRadiosNoVehicleInfo = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/two-closed-radios-no-vehicle-info.json' });
};

export const stubIdentityCustomerFlepzThreeClosedRadiosWithOneNickname = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/three-closed-radios-one-with-nickname.json' });
};

export const stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPay = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/satellite-organic_active-self-pay.json' });
};

export const stubIdentityCustomerFlepzSatelliteOrganicMultipleActiveSelfPay = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/satellite-organic-multiple-active-self-pay.json' });
};

export const stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPayAndTrial = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/satellite-organic-active-self-pay-and-trial.json' });
};

export const stubIdentityCustomerFlepzSatelliteOrganicWithSiriusAllAccessSuccess = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/satellite-organic_with-sirius-all-access-success.json' });
};

export const stubIdentityDeviceLicensePlateSatelliteOrganicWithSiriusAllAccessSuccess = () => {
    cy.intercept('POST', '**/services/identity/device/license-plate', {
        fixture: 'de-microservices/identity/device/license-plate/found.json',
    });
};

export const stubIdentityCustomerEntitlementSuccess = () => {
    cy.intercept('POST', '**/services/identity/customer/entitlement', { fixture: 'de-microservices/identity/customer/entitlement/success.json' });
};

export const stubIdentityDeviceLicensePlateFound = () => {
    cy.intercept('POST', '**/services/identity/device/license-plate', { fixture: 'de-microservices/identity/device/license-plate/found.json' });
};

export const stubIdentityDeviceLicensePlateNotFound = () => {
    cy.intercept('POST', '**/services/identity/device/license-plate', { fixture: 'de-microservices/identity/device/license-plate/not-found.json', statusCode: 500 });
};

export const stubIdentityRegistrationFlepzSystemError = () => {
    cy.intercept('POST', '**/services/identity/registration/flepz', {
        statusCode: 500,
        fixture: 'de-microservices/identity/registration/flepz/system-error.json',
    });
};

export const stubIdentityRegistrationFlepzNoAccountFound = () => {
    cy.intercept('POST', '**/services/identity/registration/flepz', { fixture: 'de-microservices/identity/registration/flepz/no-account-found.json' });
};
export const stubIdentityRegistrationFlepzTwoAccountsFound = () => {
    cy.intercept('POST', '**/services/identity/registration/flepz', { fixture: 'de-microservices/identity/registration/flepz/two-accounts-found.json' });
};
export const stubIdentityRegistrationFlepzOneAccountFound = () => {
    cy.intercept('POST', '**/services/identity/registration/flepz', { fixture: 'de-microservices/identity/registration/flepz/one-account-found.json' });
};

export const stubIdentityStreamingFlepzSuccess = () => {
    cy.intercept('POST', '**/services/identity/streaming/flepz', { fixture: 'de-microservices/identity/streaming/flepz/success.json' });
};
