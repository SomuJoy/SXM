export const cyGetE2eOemOfferStepSubmit = () => cy.get('[data-e2e="oem.offerStep.Submit"]');
export const cyGetE2eOemPaymentFormName = () => cy.get('[data-e2e="oem.paymentForm.name"]');
export const cyGetE2eOemPaymentFormCcNumberMasked = () => cy.get('[data-e2e="oem.paymentForm.ccNumberMasked"]');
export const cyGetE2eOemPaymentFormCcNumber = () => cy.get('[data-e2e="oem.paymentForm.ccNumber"] input');
export const cyGetE2eOemPaymentFormCcExpirationMonth = () => cy.get('[data-e2e="oem.paymentForm.ccExpirationMonth"] input');
export const cyGetE2eOemPaymentFormCcExpirationYear = () => cy.get('[data-e2e="oem.paymentForm.ccExpirationYear"] input');
export const cyGetE2eOemPaymentFormCcCVV = () => cy.get('[data-e2e="oem.paymentForm.ccCVV"]');
export const cyGetE2eOemPaymentFormSubmit = () => cy.get('[data-e2e="oem.paymentForm.submit"]');

export const cyGetE2eOemCCAddress = () => cy.get('[data-e2e="oem.CCAddress"]');
export const cyGetE2eOemCCCity = () => cy.get('[data-e2e="oem.CCCity"]');
export const cyGetE2eOemCCState = () => cy.get('[data-e2e="oem.CCState"]');
export const cyGetE2eOemCCZipCode = () => cy.get('[data-e2e="oem.CCZipCode"]');

export const cyGetE2eOemBillingAddressSubmit = () => cy.get('[data-e2e="oem.billingAddress.submit"]');

export const cyGetE2eVerifyAddressRetainButton = () => cy.get('[data-e2e="verifyAddress.retainButton"]');
export const cyGetE2eVerifyAddressReenterButton = () => cy.get('[data-e2e="verifyAddress.reenterButton"]');

export const cyGetE2eChargeAgreementCheckbox = () => cy.get('[data-e2e="chargeAgreementCheckbox"]');

export const cyGetE2eOemSummaryStepCompleteButton = () => cy.get('[data-e2e="oem.summaryStep.completeButton"]');
