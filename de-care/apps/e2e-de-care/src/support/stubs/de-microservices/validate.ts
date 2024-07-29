// TODO: update these to support passing in the address data to use
export const stubValidateCustomerInfoAddressAutoCorrectSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: `de-microservices/validate/customer-info/address-auto-correct-success.json` });
};

export const stubValidateCustomerInfoAddressInvalidSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: `de-microservices/validate/customer-info/address-invalid-success.json` });
};

export const stubValidateCustomerInfoAddressSuggestSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: `de-microservices/validate/customer-info/address-suggest-success.json` });
};

export const stubValidateCustomerInfoUsernameInvalid = (alias?: string) => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: `de-microservices/validate/customer-info/username-invalid.json` }).as(
        alias || 'customerInfoUsernameInvalid'
    );
};

export const stubValidatePasswordSuccess = () => {
    cy.intercept('POST', '**/services/validate/password', { fixture: 'de-microservices/validate/password/success.json' });
};

export const stubValidateUniqueLoginSuccess = () => {
    cy.intercept('POST', '**/services/validate/unique-login', { fixture: 'de-microservices/validate/unique-login/success.json' });
};

export const stubValidateEmailSuccess = () => {
    cy.intercept('POST', '**/services/validate/email', { fixture: 'de-microservices/validate/email/success.json' });
};

export const stubValidateCustomerInfoNewCC = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/new-cc.json' });
};

export const stubValidateCustomerInfoServiceLaneTwoClickValidAddress = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/sl2c-customer-info-valid-address.json' });
};

export const stubAccountCustomerInfoTrialActivationOrganic = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/trial-activation-organic-success.json' });
};
