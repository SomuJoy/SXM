import { e2eVerifyAddressReenterButton, e2eVerifyAddressRetainButton } from '@de-care/customer-info';

export const cyGetE2eVerifyAddressRetainButton = () => cy.get(e2eVerifyAddressRetainButton);
export const cyGetE2eVerifyAddressReenterButton = () => cy.get(e2eVerifyAddressReenterButton);
