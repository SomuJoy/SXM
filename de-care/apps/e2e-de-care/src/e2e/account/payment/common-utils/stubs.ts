export const stubAccountCreditCardCurrentBalance = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/credit-card-current-balance.json' });
};

export const stubAccountCreditCardNextPaymentAmount = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/credit-card-next-payment-amount.json' });
};

export const stubAccountCreditCardCurrentAndNextPaymentAmount = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/credit-card-current-and-next-payment-amount.json' });
};

export const stubAccountSuspendedRadio = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/suspended-radio.json' });
};
export const stubAccountInvoiceCurrentAndNextPaymentAmount = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/invoice-current-and-next-payment-amount.json' });
};
export const stubReactivationQuote = () => {
    cy.intercept('POST', '**/services/quotes/reactivation-quote', { fixture: 'de-microservices/quotes/reactivation-quote/success.json' });
};
export const stubMakePayment = () => {
    cy.intercept('POST', '**/services/payment/make-payment', { fixture: 'de-microservices/payment/make-payment/success.json' });
};
export const stubUpdatePayment = () => {
    cy.intercept('POST', '**/services/payment/update-payment-info', { fixture: 'de-microservices/payment/make-payment/success.json' });
};
export const stubCustomerInfo = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/success.json' });
};
