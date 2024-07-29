import {
    e2eOneStepNewAccountFormAddressLine1Field,
    e2eOneStepNewAccountFormAddressLine1Label,
    e2eOneStepNewAccountFormCityField,
    e2eOneStepNewAccountFormCityLabel,
    e2eOneStepNewAccountFormFirstNameField,
    e2eOneStepNewAccountFormFirstNameLabel,
    e2eOneStepNewAccountFormInteractiveEmailField,
    e2eOneStepNewAccountFormInteractiveEmailLabel,
    e2eOneStepNewAccountFormLastNameField,
    e2eOneStepNewAccountFormLastNameLabel,
    e2eOneStepNewAccountFormPhoneNumberField,
    e2eOneStepNewAccountFormPhoneNumberLabel,
    e2eOneStepNewAccountFormPostalCodeField,
    e2eOneStepNewAccountFormPostalCodeLabel,
    e2eOneStepNewAccountFormProvince,
    e2eOneStepNewAccountFormStepVehicleEligibilityText,
    e2eOneStepNewAccountFormSubmitButton
} from '@de-care/de-care-use-cases/trial-activation/feature-legacy';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

export const cyGetOneStepNewAccountFormInteractiveEmailLabel = () => cy.get(e2eOneStepNewAccountFormInteractiveEmailLabel);
export const cyGetOneStepNewAccountFormInteractiveEmailField = () => cy.get(e2eOneStepNewAccountFormInteractiveEmailField);

export const cyGetOneStepNewAccountFormFirstNameLabel = () => cy.get(e2eOneStepNewAccountFormFirstNameLabel);
export const cyGetOneStepNewAccountFormFirstNameField = () => cy.get(e2eOneStepNewAccountFormFirstNameField);

export const cyGetOneStepNewAccountFormLastNameLabel = () => cy.get(e2eOneStepNewAccountFormLastNameLabel);
export const cyGetOneStepNewAccountFormLastNameField = () => cy.get(e2eOneStepNewAccountFormLastNameField);

export const cyGetOneStepNewAccountFormPhoneNumberLabel = () => cy.get(e2eOneStepNewAccountFormPhoneNumberLabel);
export const cyGetOneStepNewAccountFormPhoneNumberField = () => cy.get(e2eOneStepNewAccountFormPhoneNumberField);

export const cyGetOneStepNewAccountFormAddressLine1Label = () => cy.get(e2eOneStepNewAccountFormAddressLine1Label);
export const cyGetOneStepNewAccountFormAddressLine1Field = () => cy.get(e2eOneStepNewAccountFormAddressLine1Field);

export const cyGetOneStepNewAccountFormCityLabel = () => cy.get(e2eOneStepNewAccountFormCityLabel);
export const cyGetOneStepNewAccountFormCityField = () => cy.get(e2eOneStepNewAccountFormCityField);

export const cyGetOneStepNewAccountFormPostalCodeLabel = () => cy.get(e2eOneStepNewAccountFormPostalCodeLabel);
export const cyGetOneStepNewAccountFormPostalCodeField = () => cy.get(e2eOneStepNewAccountFormPostalCodeField);

export const cyGetOneStepNewAccountFormProvince = () => cy.get(e2eOneStepNewAccountFormProvince);
export const cyGetOneStepNewAccountFormSubmitButton = () => cy.get(e2eOneStepNewAccountFormSubmitButton);

export const cyGetOneStepNewAccountFormStepVehicleEligibilityText = () => cy.get(e2eOneStepNewAccountFormStepVehicleEligibilityText);

export const cyGetSxmDropDownItem = () => cy.get(e2eSxmDropDownItem);
