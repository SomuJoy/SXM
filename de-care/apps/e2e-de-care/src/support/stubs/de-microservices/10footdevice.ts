export const stub10FootDeviceValidateActivationCodeFound = () => {
    cy.intercept('POST', '**/services/10footdevice/validate-code', { fixture: 'de-microservices/10footdevice/validate-code/success.json' });
};

export const stub10FootDeviceRegister = () => {
    cy.intercept('POST', '**/services/10footdevice/register', { fixture: 'de-microservices/10footdevice/register/success.json' });
};
