export const stubMakePayment = () => {
    cy.intercept('POST', '**/services/payment/make-payment', { fixture: 'de-microservices/payment/make-payment/success.json' });
};

export const stubPaymentCreditCardValidateSuccess = () => {
    cy.intercept('POST', '**/services/creditcard/validate', { fixture: 'de-microservices/payment/creditcard/validate/success.json' });
};

export const stubPaymentGiftcardInfoSuccess = () => {
    cy.intercept('POST', '**/services/giftcard/info', { fixture: 'de-microservices/payment/giftcard/info/success.json' });
};
