import { e2eYourInfo, e2eYourInfoContinueButton } from '@de-care/identification';
import { e2eYourDeviceInfo } from '@de-care/customer-info';

export const cyGetYourInfo = () => cy.get(e2eYourInfo);
export const cyGetYourInfoContinueButton = () => cy.get(e2eYourInfoContinueButton);
export const cyGetYourDeviceInfo = () => cy.get(e2eYourDeviceInfo);
