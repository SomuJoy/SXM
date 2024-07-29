export const deviceLookupEnterRadioIdAndSubmit = () => {
    cy.get('[data-test="radioIdLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-test="radioIdInput"] input[type="text"]').clear().type('abcdef123');
    cy.get('[data-test="continueButton"]').click();
};

export const fillOutNewPaymentInfoAddress = () => {
    cy.get('[data-test="CCAddress"]').clear({ force: true }).type('1 River Rd', { force: true });
    cy.get('[data-test="CCCity"]').clear({ force: true }).type('Schenectady', { force: true });
    cy.get('[data-test="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
};

export const fillOutNewPaymentInfoCreditCard = () => {
    cy.get('[data-test="sxmUINameOnCard"]').type('TEST NAME');
    cy.get('[data-test="sxmUICreditCardNumber"]').clear().type('4111111111111111');
    cy.get('[data-test="creditCardFormFields.ccExpirationDate"]').clear({ force: true }).type('0225', { force: true });
    cy.get('[data-test="sxmUICvvFormField"]').clear().type('121');
};
