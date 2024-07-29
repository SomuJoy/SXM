import { e2eHeaderProvinceSection } from '@de-care/de-care-use-cases/shared/ui-header-bar-canada';
import { e2eSl2cConfirmationTrialExpiryNotice } from '@de-care/de-care-use-cases/trial-activation/feature-sl2c';
import { e2eActivateTrialButton, e2eEmail, e2eFirstName, e2eLastName, e2ePhoneNumber, e2eRadioIdVin } from '@de-care/de-care-use-cases/trial-activation/ui-sl2c-form';

export const cyGetRadioIdVin = () => cy.get(e2eRadioIdVin);
export const cyGetFirstName = () => cy.get(e2eFirstName);
export const cyGetLastName = () => cy.get(e2eLastName);
export const cyGetPhoneNumber = () => cy.get(e2ePhoneNumber);
export const cyGetEmail = () => cy.get(e2eEmail);
export const cyGetActivateTrialButton = () => cy.get(e2eActivateTrialButton);

export const cyGetSl2cConfirmationTrialExpiryNotice = () => cy.get(e2eSl2cConfirmationTrialExpiryNotice);
export const cyGetHeaderProvinceSection = () => cy.get(e2eHeaderProvinceSection);
