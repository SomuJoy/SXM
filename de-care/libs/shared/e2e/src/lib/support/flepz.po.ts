import { e2eFlepzFormContinueButton, e2eVerifyDeviceTabsFlepzForm } from '@de-care/identification';
import { e2eFlepzVerifyDeviceTabs } from '@de-care/purchase';
import {
    e2eFlepzEmailTextfield,
    e2eFlepzFirstNameTextfield,
    e2eFlepzLastNameTextfield,
    e2eFlepzPhoneNumberTextfield,
    e2eFlepzZipCodeTextfield
} from '@de-care/shared/sxm-ui/ui-flepz-form-fields';

export const cyGetFlepzFirstNameTextfield = () => cy.get(e2eFlepzFirstNameTextfield);
export const cyGetFlepzLastNameTextfield = () => cy.get(e2eFlepzLastNameTextfield);
export const cyGetFlepzPhoneNumberTextfield = () => cy.get(e2eFlepzPhoneNumberTextfield);
export const cyGetFlepzZipCodeTextfield = () => cy.get(e2eFlepzZipCodeTextfield);
export const cyGetFlepzEmailTextfield = () => cy.get(e2eFlepzEmailTextfield);

export const cyGetFlepzVerifyDeviceTabs = () => cy.get(e2eFlepzVerifyDeviceTabs);
export const cyGetVerifyDeviceTabsFlepzForm = () => cy.get(e2eVerifyDeviceTabsFlepzForm);

export const cyGetFlepzFormContinueButton = () => cy.get(e2eFlepzFormContinueButton);
