import { accountLookupEmailField, accountLookupButton } from '@de-care/identification';

export const cyGetAccountLookupEmailField = () => cy.get(accountLookupEmailField);
export const cyGetAccountLookupButton = () => cy.get(accountLookupButton);
