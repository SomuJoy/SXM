export const enterNewRadioIdAndContinue = () => {
    cy.get('[data-test="radioLookupOptions.carInfoContinueButton"]').first().click({ force: true });
    cy.get('[data-test="lookupRadioId.input"]').type('990005205820');
    cy.get('[data-test="lookupRadioId.button"]').first().click({ force: true });
};

export const enterNewAccountFlepzInfo = () => {
    cy.get('[data-test="NewAccountPhoneNumber"]').first().type('2122222222', { force: true });
    cy.get('[data-test="NewAccountAddress"]').first().type('234 Test Street', { force: true });
    cy.get('[data-test="NewAccountCity"]').first().type('Tampa', { force: true });
    cy.get('[data-test="NewAccountState"]').first().contains('FL').click({ force: true });
    cy.get('[data-test="NewAccountZip"]').first().type('12345', { force: true });
    cy.get('[data-test="sxmUIPassword"]').first().type('P@ssw0rd12', { force: true });
};
