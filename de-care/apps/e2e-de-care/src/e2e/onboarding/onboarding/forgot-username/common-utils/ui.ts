export const fillOutResetForm = () => {
    cy.get('[data-test="lastname"]').clear().type('Ninja');
    cy.get('[data-test="email"]').clear().type('Ninja@siriusxm.com');
};
export const resetUsernameSubmitForm = () => {
    cy.get('[data-test="CreateCredentialsFormSubmitButton"]').click();
};
export const fillOutResetUsernameFormAndSubmit = () => {
    fillOutResetForm();
    resetUsernameSubmitForm();
};
export const getUserNameButton = () => {
    cy.get('[data-test="getUsernameLink"]').click();
};
export const forgotUsernameUrl = () => {
    cy.visit(`/account/credentials/forgot-username?src=oac`);
};
export const emailSentPage = () => {
    cy.visit(`account/credentials/forgot-username-mail-sent-confirmation?src=oac`);
};
export const noAccountSentPage = () => {
    cy.visit(`account/credentials/account-not-found?src=oac`);
};
export const fillRadioId = () => {
    cy.get('[data-test="radioId"]').clear().type('0LDC2BW9');
};
export const searchByRadioButton = () => {
    cy.get('[data-test="CreateCredentialsFormSubmitButton"]').click();
};
