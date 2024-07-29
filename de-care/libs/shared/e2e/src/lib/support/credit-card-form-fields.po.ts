import {
    e2eCreditCardFormFieldsCCNameOnCard,
    e2eCreditCardFormFieldsCCExpirationDate,
    e2eCreditCardFormFieldsCCUnexpectedErrorCopy
} from '@de-care/domains/purchase/ui-credit-card-form-fields';

export const cyGetE2ECreditCardFormFieldsCCNameOnCard = () => cy.get(e2eCreditCardFormFieldsCCNameOnCard);
export const cyGetE2ECreditCardFormFieldsCCExpirationDate = () => cy.get(e2eCreditCardFormFieldsCCExpirationDate);
export const cyGetE2ECreditCardFormFieldsCCUnexpectedErrorCopy = () => cy.get(e2eCreditCardFormFieldsCCUnexpectedErrorCopy);
