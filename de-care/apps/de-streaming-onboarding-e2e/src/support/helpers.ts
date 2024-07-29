export const servicesUrlPrefix = `**/services`;

export const submitFlepz = (mockResponseData) => {
    cy.route('POST', `${servicesUrlPrefix}/identity/streaming/flepz`, mockResponseData);
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click({ force: true });
};

export const mockResponses = {
    existingsxirnocredentials: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-existing-sxir-no-credentials.json'),
    existingsxir: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-existing-sxir-has-oac-credentials.json'),
    existingsxiroacfalse: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-existing-sxir.json'),
    sxir_standalone: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-sxir-standalone.json'),
    paymentissues: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-payment-issues.json'),
    expiredaatrial: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-expired-aa-trial.json'),
    insufficientpackage: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-insufficient-package.json'),
    nonconsumer: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-non-consumer.json'),
    trialwithinlasttrialdate: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-trial-within-last-trial-date.json'),
    maxlifetimetrials: require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-ineligible-max-lifetime-trials.json'),
};

export const fillOutFlepzWithGeneralData = () => {
    // NOTE: These values don't matter here because we mock the endpoint response (it doesn't use the request values).
    //       We just need to fill out the form fields with valid data.
    cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('Mikey', { force: true });
    cy.get('[data-e2e="FlepzLastNameTextfield"]').type('Cypress', { force: true });
    cy.get('[data-e2e="FlepzEmailTextfield"]').type('mikebeetest@testing.com', { force: true });
    cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('8059999999', { force: true });
    cy.get('[data-e2e="FlepzZipCodeTextfield"]').type('12345', { force: true });
};

export const goToRadioIdVinLookup = () => {
    cy.route('POST', `${servicesUrlPrefix}/identity/streaming/flepz`, require('../fixtures/features/analytics/streaming-onboarding/streaming-flepz-no-match.json'));
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click({ force: true });
};

export const getToRegistration = () => {
    goToRadioIdVinLookup();
    cy.route('GET', `${servicesUrlPrefix}/utility/security-questions`, require('../fixtures/features/analytics/streaming-onboarding/security-questions.json'));
    cy.route('POST', `${servicesUrlPrefix}/device/validate`, require('../fixtures/features/analytics/streaming-onboarding/device-validate-success.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../fixtures/features/analytics/streaming-onboarding/non-pii-account-is-in-pre-trial.json'));
    cy.get('[data-e2e="RadioIdVinTextfield"] input').type('84EPYD4Z', { force: true });
    cy.get('[data-e2e="SearchRadioIdVinFormSubmitButton"]').click({ force: true });
};

export const goToRegistrationCredentials = () => {
    getToRegistration();
    cy.get('[data-e2e="CCAddress"]').type('100 Street', { force: true });
    cy.get('[data-e2e="CCCity"]').type('Anytown', { force: true });
    cy.get('[data-e2e="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-e2e="CCZipCode"]').type('12345', { force: true });
    cy.get('[data-e2e="sxmUIPhoneNumber"]').type('1111111111', { force: true });
    cy.route('POST', `${servicesUrlPrefix}/validate/customer-info`, require('../fixtures/features/analytics/streaming-onboarding/validate-customer-address-success.json'));
    cy.get('[data-e2e="RegistrationAddressSubmitButton"]').click({ force: true });
};

export const goToRegistrationSecurityQuestions = () => {
    goToRegistrationCredentials();
    cy.route('POST', `${servicesUrlPrefix}/validate/password`, require('../fixtures/features/analytics/streaming-onboarding/validate-password-success.json'));
    cy.get('[data-e2e="username"] input').type('test@tester.com', { force: true });
    cy.get('[data-e2e="password"] input').type('mySECRET2#', { force: true });
    cy.get('[data-e2e="RegistrationCredentialsSubmitButton"]').click({ force: true });
};
