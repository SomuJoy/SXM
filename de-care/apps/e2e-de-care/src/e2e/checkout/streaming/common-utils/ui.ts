export const visitStreamingTrialActivationURL = () => {
    cy.visit(`/subscribe/trial/streaming?promocode=SXM-Y2KYZNBYXE`);
};

export const fillOutAccountEmailForm = () => {
    cy.get('[data-e2e="accountLookup.emailField"]').type('randomuser@siriusxm.com', { force: true });
};

export const submitAccountLookupForm = () => {
    cy.get('[data-e2e="accountLookup.lookupButton"]').click();
};

export const fillOutAccountInfoForm = () => {
    cy.get('[data-e2e="newAccountFormFields.firstNameInput"]').type('Random', { force: true });
    cy.get('[data-e2e="newAccountFormFields.lastNameInput"]').type('Person', { force: true });
    cy.get('[data-e2e="newAccountFormFields.phoneNumber"]').type('8052222222', { force: true });
    cy.get('[data-e2e="sxmUIPostalCodeFormField"]').first().type('12345', { force: true });
};

export const fillOutLoginForm = () => {
    cy.get('[data-test="usernameFormField"]').clear().type('userrtd23@siriusxm.com');
    cy.get('[data-test="sxmUIPassword"]').clear().type('P@ssword!');
};

export const fillOutStartMyTrial = () => {
    fillOutAccountInfoForm();
    fillOutLoginForm();
};

export const confirmStartMyTrialButton = () => {
    cy.get('[data-e2e="ConfirmationButton"]').click({ force: true });
};

export const visitDefaultOfferPage = () => {
    cy.visit(`/subscribe/checkout/streaming?ineligibleForOffer=true`);
};
