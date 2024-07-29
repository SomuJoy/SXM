export const visitCheckoutOrganicAccordion = () => {
    cy.visit(`/subscribe/checkout/streaming`);
};
export const visitCheckoutTargetedAccordionWithToken = () => {
    cy.visit(`/subscribe/checkout/streaming?tkn=VALID_TOKEN`);
};
export const fillOutAccountLookupForm = () => {
    cy.get('input[id="email"]').clear().type('variantperson@siriusxm.com');
    cy.get('input[type="password"]').clear().type('asdASD23@');
};
export const submitAccountLookupForm = () => {
    cy.get('[data-e2e="accountLookup.lookupButton"]').click();
};
const fillOutPaymentInfoForm = () => {
    cy.get('input[autocomplete="given-name"]').clear().type('Variant');
    cy.get('input[autocomplete="family-name"]').clear().type('Person');
    cy.get('input[autocomplete="tel-national"]').clear().type('8051111111');
    cy.get('input[name="cc-number"]').clear().type('4111222233334444');
    cy.get('input[name="cc-exp"]').clear({ force: true }).type('0230');
    cy.get('input[name="cc-csc"]').clear().type('123');
    cy.get('input[data-e2e="sxmUIPostalCodeFormField"]').clear().type('12345');
};
const submitPaymentForm = () => {
    cy.get('payment-info-streaming-organic button[type="submit"]').click();
};
export const fillOutAndSubmitPaymentInfoForm = () => {
    fillOutPaymentInfoForm();
    submitPaymentForm();
};
export const fillOutAndSubmitTargetedPaymentInfo = () => {
    cy.get('[data-e2e="FlepzFirstNameTextfield"]').clear({ force: true }).type('Mike', { force: true });
    cy.get('[data-e2e="FlepzLastNameTextfield"]').clear({ force: true }).type('Test', { force: true });
    cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').clear({ force: true }).type('8052222222', { force: true });
    cy.get('[data-e2e="CCAddress"]').first().clear({ force: true }).type('1234 Block', { force: true });
    cy.get('[data-e2e="CCCity"]').first().clear({ force: true }).type('Beverly Hills', { force: true });
    cy.get('[data-e2e="CCState"]').first().contains('CA').click({ force: true });
    cy.get('[data-e2e="CCZipCode"]').first().clear({ force: true }).type('90210', { force: true });
    cy.get('[data-e2e="CCNameOnCardTextfield"]').clear({ force: true }).type('Mike Test', { force: true });
    cy.get('[data-e2e="CCCardNumberTextfield"]').clear({ force: true }).type('4111111111111111', { force: true });
    cy.get('[data-e2e="ccExpDateOnCardTextfield"]').clear({ force: true }).type('02/30', { force: true });
    cy.get('[data-e2e="ccCVV"]').clear({ force: true }).type('123', { force: true });
    cy.get('[data-e2e="CreateLoginEmailTextfield"]').clear({ force: true }).type('mytest@siriusxm.com', { force: true });
    cy.get('[data-e2e="sxmUIPassword"]').clear({ force: true }).type('@PWEasd!', { force: true });
    cy.get('[data-e2e="PaymentConfirmationButton"]').click({ force: true });
};
export const acceptAndSubmitTransaction = () => {
    cy.get('charge-agreement label').click({ force: true });
    cy.get('[data-e2e="reviewOrder.completeButton"]').click();
};
