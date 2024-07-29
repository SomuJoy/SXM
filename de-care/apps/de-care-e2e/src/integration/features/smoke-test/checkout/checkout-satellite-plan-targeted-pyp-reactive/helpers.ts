export const mockOfferCalls = (offersResponse, offersInfoResponse) => {
    cy.route('POST', '**/offers/customer', offersResponse);
    cy.route('POST', '**/offers/info', offersInfoResponse);
};
export const mockSuccessfulPaymentInfoCalls = (customerInfoResponse, captchaResponse, quoteResponse) => {
    cy.route('POST', '**/validate/customer-info', customerInfoResponse);
    cy.route('POST', '**/check-eligibility/captcha', captchaResponse);
    cy.route('POST', '**/quotes/quote', quoteResponse);
};
export const fillOutPaymentInfoForm = () => {
    cy.get('sxm-ui-radio-option-form-field[value="NEW_CARD"] input[type="radio"]').click({ force: true });
    cy.get('input[data-e2e="CCAddress"]').clear({ force: true }).type('111 Test Street', { force: true });
    cy.get('input[data-e2e="CCCity"]').clear({ force: true }).type('Anytown', { force: true });
    cy.get('[data-e2e="CCState"]')
        .click({ force: true })
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]').contains('AK').scrollIntoView().click({ force: true });
        });
    cy.get('input[data-e2e="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('input[name="cc-name"]').clear({ force: true }).type('Test Person', { force: true });
    cy.get('input[name="cc-number"]').clear({ force: true }).type('4111111111111111', { force: true });
    cy.get('input[name="cc-exp"]').clear({ force: true }).type('0230', { force: true });
    cy.get('input[name="cc-csc"]').clear({ force: true }).type('123', { force: true });
};
export const submitPaymentForm = () => {
    cy.get('#paymentForm button[sxm-proceed-button]').click({ force: true });
};
export const fillOutAndSubmitPaymentInfoForm = () => {
    fillOutPaymentInfoForm();
    submitPaymentForm();
};
export const acceptTransaction = () => {
    cy.get('input[name="chargeAgreementAccepted"]').click({ force: true });
};
export const submitTransaction = () => {
    cy.get('#transactionForm button[sxm-proceed-button]').click({ force: true });
};
export const acceptAndSubmitTransaction = () => {
    acceptTransaction();
    submitTransaction();
};
export const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown').eq(index).click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]').eq(index).click({ force: true });
        });
    cy.get(`input#regActSecAnswer${index}`).type(text, { force: true });
};
