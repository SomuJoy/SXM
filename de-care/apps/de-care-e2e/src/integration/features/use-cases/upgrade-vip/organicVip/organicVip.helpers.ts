import { e2ePaymentInfoUseExistingCard, e2ePaymentConfirmationButton } from '@de-care/customer-info';
import { e2eChargeAgreementCheckbox } from '@de-care/review-order';

export const mockRoutesForOrganicPlatinumVipOffers = () => {
    cy.intercept('POST', '**/services/offers', require('../../../../../fixtures/use-cases/upgrade-vip/offers.json'));
    cy.intercept('POST', '**/services/offers/info', require('../../../../../fixtures/use-cases/upgrade-vip/info.json'));
};

export const mockRoutesForOrganicPlatinumVipFirstRadioValid = () => {
    cy.intercept('POST', '**/services/device/validate', require('../../../../../fixtures/use-cases/upgrade-vip/validate-first-success.json'));
    cy.intercept('POST', '**/services/account/upgrade-vip', require('../../../../../fixtures/use-cases/upgrade-vip/upgrade-vip-first-success.json'));
    cy.intercept('POST', '**/services/offers/customer', require('../../../../../fixtures/use-cases/upgrade-vip/customer-first-success.json'));
};

export const mockRoutesForOrganicPlatinumVipNonPii = () => {
    cy.intercept('POST', '**/services/account/non-pii', require('../../../../../fixtures/use-cases/upgrade-vip/non-pii.json'));
};

export const mockRoutesForOrganicPlatinumVipCatcha = () => {
    cy.intercept('POST', '**/services/check-eligibility/captcha', require('../../../../../fixtures/use-cases/upgrade-vip/captcha.json'));
};

export const mockRoutesForOrganicPlatinumVipWith2EligibleRadiosSuccess = () => {
    mockRoutesForOrganicPlatinumVipFirstRadioValid();
    mockRoutesForOrganicPlatinumVipNonPii();
    mockRoutesForOrganicPlatinumVipCatcha();
    cy.intercept('POST', '**/services/device/validate', require('../../../../../fixtures/use-cases/upgrade-vip/validate-second-success.json'));
    cy.intercept('POST', '**/services/quotes/quote', require('../../../../../fixtures/use-cases/upgrade-vip/quote.json'));
    cy.intercept('POST', '**/services/purchase/change-subscription', require('../../../../../fixtures/use-cases/upgrade-vip/change-sub-success.json'));
    cy.intercept('POST', '**/services/purchase/add-subscription', require('../../../../../fixtures/use-cases/upgrade-vip/add-sub-success.json'));
};

export const mockRoutesForOrganicPlatinumVipWith1EligibleRadioSuccess = () => {
    mockRoutesForOrganicPlatinumVipFirstRadioValid();
    mockRoutesForOrganicPlatinumVipNonPii();
    mockRoutesForOrganicPlatinumVipCatcha();
    cy.intercept('POST', '**/services/quotes/quote', require('../../../../../fixtures/use-cases/upgrade-vip/quote-for-one-radio.json'));
    cy.intercept('POST', '**/services/purchase/change-subscription', require('../../../../../fixtures/use-cases/upgrade-vip/change-sub-for-one-radio-success.json'));
};

export const mockRoutesForOrganicPlatinumVipWithSecondIneligibleRadio = () => {
    mockRoutesForOrganicPlatinumVipFirstRadioValid();
    cy.intercept('POST', '**/services/account/non-pii', require('../../../../../fixtures/use-cases/upgrade-vip/non-pii-second-error.json'));
    cy.intercept('POST', '**/services/device/validate', require('../../../../../fixtures/use-cases/upgrade-vip/validate-second-error.json'));
};

export const addAccountInfoForFirstRadio = (firstRadio: string, accountNumber: string) => {
    cy.get('[data-e2e="sxmUIRadioIdFormField"]').type(firstRadio);
    cy.get('[data-e2e="sxmUIAccountNumberFormField"]').type(accountNumber);
    cy.get('[data-e2e="RadioAndAccountLookupForm.submitButton"]').click({ force: true });
};

export const confirmPrimaryRadioEligible = (firstRadio: string) => {
    cy.get('[data-e2e="sxmUiModal.content"]').should('be.visible');
    cy.get('[data-e2e="accountLookupStepModal.radioList"]').should('contain', firstRadio);
    cy.get('[data-e2e="accountLookupStepModal.submitButton"]').click({ force: true });
};

export const confirmFirstRadioInfoIsPresented = (firstRadio: string) => {
    cy.get('[data-e2e="firstStepForm.RadioList"]').should('contain', firstRadio);
};

export const selectFindSecondRadio = () => {
    cy.get('[data-e2e="firstStepForm.findAsecondRadio"] [data-e2e="radioOptionLabel"]').click({ force: true });
    cy.get('[data-e2e="firstStepForm.continueButton"]').click({ force: true });
};

export const addSecondRadioInfo = (secondRadio: string) => {
    cy.get('[data-e2e="radioLookupOptions.carInfoContinueButton"]').click({ force: true });
    cy.get('[data-e2e="lookupRadioId.input"]').type(secondRadio);
    cy.get('[data-e2e="lookupRadioId.button"]').click({ force: true });
};

export const confirmSecondRadioIsEligible = (secondRadio: string) => {
    cy.get('[data-e2e="confirmRadioModal"]').should('contain', secondRadio);
    cy.get('[data-e2e="confirmRadioModal.submitButton"]').click({ force: true });
};

export const selectPaymentMethodAndSubmit = () => {
    cy.get(e2ePaymentInfoUseExistingCard).click({ force: true });
    cy.get(e2ePaymentConfirmationButton).click();
};

export const confirmRadiosInfoIsPresented = (firstRadio: string, secondRadio?: string) => {
    cy.get('[data-e2e="AccordionStepper.Content"]').should('contain', firstRadio);
    if (secondRadio) {
        cy.get('[data-e2e="AccordionStepper.Content"]').should('contain', secondRadio);
    }
};

export const submitReviewAndSubmitStep = () => {
    cy.get(e2eChargeAgreementCheckbox).click({ force: true });
    cy.get('[data-e2e="UpgradeVIPOrganic.ConfirmReviewAndSubmitButton"]').click({ force: true });
};

export const selectContinueWithOneRadio = () => {
    cy.get('[data-e2e="firstStepForm.addSecondRadioLater"] [data-e2e="radioOptionLabel"]').click({ force: true });
    cy.get('[data-e2e="firstStepForm.continueButton"]').click({ force: true });
    cy.get('[data-e2e="areYouSureModal.submitButton"]').click({ force: true });
};

export const confirmSecondRadioIsIneligible = () => {
    cy.get('[data-e2e="notEligibleRadioModal"]').should('contain', 'not eligible');
};
