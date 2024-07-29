import { e2eCheckboxFormField } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { e2eSxmUIEmail, e2eSxmUIEmailLabel } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { e2eRadioOptionLabel } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { e2eSxmUITextFormField, e2eSxmUITextFormFieldLabel } from '@de-care/shared/sxm-ui/ui-text-form-field';

export const cyGetRadioOptionLabel = () => cy.get(e2eRadioOptionLabel);

export const cyGetSxmUIPhoneNumber = () => cy.get('[data-e2e="sxmUIPhoneNumber"]');
export const cyGetSxmUIPhoneNumberLabel = () => cy.get('[data-e2e="sxmUIPhoneNumber.label"]');
export const cyGetSxmUIEmail = () => cy.get(e2eSxmUIEmail);
export const cyGetSxmUIEmailLabel = () => cy.get(e2eSxmUIEmailLabel);
export const cyGetCheckboxFormField = () => cy.get(e2eCheckboxFormField);
export const cyGetSxmUITextFormField = () => cy.get(e2eSxmUITextFormField);
export const cyGetSxmUITextFormFieldLabel = () => cy.get(e2eSxmUITextFormFieldLabel);
