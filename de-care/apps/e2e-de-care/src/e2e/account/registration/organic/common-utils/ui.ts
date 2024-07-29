export const visitRegistrationOrganic = () => {
    cy.visit(`/account/registration`);
};
export const fillOutFlepzForm = () => {
    cy.get('[data-test="FlepzFirstNameTextfield"]').clear().type('Test');
    cy.get('[data-test="FlepzLastNameTextfield"]').clear().type('Person');
    cy.get('[data-test="FlepzEmailTextfield"]').clear().type('testemail@siriusxm.com');
    cy.get('[data-test="FlepzPhoneNumberTextfield"]').clear({ force: true }).type('5555555555', { force: true });
    cy.get('[data-test="FlepzZipCodeTextfield"]').clear({ force: true }).type('12345', { force: true });
};
export const submitFlepzForm = () => {
    cy.get('[data-test="registrationIdentificationFlepzForm.continueButton"]').click();
};
export const fillOutFlepzFormAndSubmit = () => {
    fillOutFlepzForm();
    submitFlepzForm();
};
