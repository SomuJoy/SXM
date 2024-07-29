import {
    newAccountFormFieldsFirstNameField,
    newAccountFormFieldsLastNameField,
    newAccountFormFieldsPhoneNumberField
} from '@de-care/domains/account/ui-new-account-form-fields';

export const cyGetNewAccountFormFieldsFirstNameField = () => cy.get(newAccountFormFieldsFirstNameField);
export const cyGetNewAccountFormFieldsLastNameField = () => cy.get(newAccountFormFieldsLastNameField);
export const cyGetNewAccountFormFieldsPhoneNumberField = () => cy.get(newAccountFormFieldsPhoneNumberField);
