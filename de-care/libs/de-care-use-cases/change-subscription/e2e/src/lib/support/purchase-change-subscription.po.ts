import { mockRoutesFromHAR } from '@de-care/shared/e2e';
import {
    e2eOfferInfotainmentFormSubmit,
    e2eOfferInfotainmentFormPlanCheckboxBundle,
    e2eOfferInfotainmentFormPlanCheckboxIndividual,
    e2eOfferInfotainmentFormInfotainmentBundle,
} from '@de-care/domains/offers/ui-offer-infotainment-form';
import { e2eOfferCardForm, e2eOfferCardFormRadioButton } from '@de-care/domains/offers/ui-offer-card-form-field';
import { e2eMultiPackageSelectionForm } from '@de-care/offers';
import { e2eSelectTermTypeForm, e2eSelectTermTypeFormMonthlyRadioButton } from '@de-care/de-care-use-cases/change-subscription/ui-common';
import { e2ePaymentFormEmailTextfield, e2ePaymentInfoUseExistingCard, e2ePaymentConfirmationButton } from '@de-care/customer-info';
import {
    e2eChangeSubscriptionPurchaseSubmitButton,
    e2eChangeSubscriptionPurchaseStepper,
    e2eChangeSubscriptionPurchaseSelectedInfotainmentPackages,
    e2eChangeSubscriptionPurchaseStepperSkipToInfotainment,
} from '@de-care/de-care-use-cases/change-subscription/feature-purchase';
import { e2eChargeAgreementCheckbox } from '@de-care/review-order';
import { e2eHeroComponentHeading } from '@de-care/domains/offers/ui-hero';
import { cyGetSxmUiAlertPill } from '@de-care/shared/sxm-ui/e2e';
import { e2eAccordionStepperContent, e2eAccordionStepperLabel } from '@de-care/shared/sxm-ui/ui-accordion-stepper';

export function mockRoutesForDataOnlySelfPay() {
    mockRoutesFromHAR(require('../fixtures/change-sub-data-only-self-paid.har.json'));
}

export function mockRoutesForDataOnlyTrialNoInfotainments() {
    mockRoutesFromHAR(require('../fixtures/change-sub-data-only-trial-no-infotainments.har.json'));
}

export function mockRoutesForDataOnlyTrialWithInfotainments() {
    mockRoutesFromHAR(require('../fixtures/change-sub-data-only-trial-infotainment.har.json'));
}

export function mockRoutesForDataOnlyTrialWithFollowOn() {
    mockRoutesFromHAR(require('../fixtures/change-sub-data-only-trial-follow-on.har.json'));
}

export function mockRoutesForExistingSubscriptionWithInfotainmentFullTransaction() {
    mockRoutesFromHAR(require('../fixtures/change-sub-existing-infotainment-full-transaction.har.json'));
}

export const mockRoutesForInfotainmentPackageOptionsFullTransaction = () =>
    mockRoutesFromHAR(require('../fixtures/change-sub-offers-with-infotainment-full-transaction.har.json'));

export const mockRoutesForDeclineInfotainmentPackageOptionsFullTransaction = () =>
    mockRoutesFromHAR(require('../fixtures/change-sub-offers-decline-infotainment-full-transaction.har.json'));

export const mockRoutesForFullTokenizedChangePlan = () => mockRoutesFromHAR(require('../fixtures/change-sub-tokenized.json'));

export const mockRoutesForTokenizedChangePlanUpgradedFailure = () => mockRoutesFromHAR(require('../fixtures/change-sub-tokenized-upgraded.json'));

export const mockRoutesForTokenizedChangePlanPromoFailure = () => mockRoutesFromHAR(require('../fixtures/change-sub-tokenized-expired-promo.json'));

export const mockRoutesForTokenizedChangePlanTokenFailure = () => mockRoutesFromHAR(require('../fixtures/change-sub-tokenized-failure.har.json'));

export const confirmCurrentSubscriptionInfoContainsInfotainment = (name) =>
    cy.get('[data-e2e="yourCurrentPlan.plan"]').should((elem) => {
        expect(elem).to.contain(name);
    });

export const confirmInfotainmentStepExists = () => {
    cy.get(e2eChangeSubscriptionPurchaseStepper).should('contain', 'infotainment');
};

export const selectAudioPackageAndSubmit = () => {
    cy.get(e2eOfferCardFormRadioButton).first().click({ force: true });
    submitChoosePackageStep();
};

export const selectPackageWithInfotainmentAndSubmit = () => {
    selectIndividualInfotainmentPackage();
    submitInfotainmentStep();
};

export const submitInfotainmentStep = () => {
    cy.get(e2eOfferInfotainmentFormSubmit).should('be.visible').click({ force: true });
};

export const confirmBundleInfotainmentPackageExists = () => {
    cy.get(e2eOfferInfotainmentFormInfotainmentBundle).should('be.visible').should('contain', 'Bundle');
};

export const confirmIndividualInfotainmentPackageIsNotSelected = () => {
    cy.get(e2eOfferInfotainmentFormPlanCheckboxIndividual).each((elem) => {
        expect(elem).not.to.be.checked;
    });
};

export const selectBundleInfotainmentPackage = () => {
    cy.get(e2eOfferInfotainmentFormPlanCheckboxBundle).first().click({ force: true });
};

export const selectIndividualInfotainmentPackage = () => {
    cy.get(e2eOfferInfotainmentFormPlanCheckboxIndividual).first().click({ force: true });
};

export const selectIndividualInfotainmentPackages = () => {
    cy.get(e2eOfferInfotainmentFormPlanCheckboxIndividual).each((elem) => {
        cy.wrap(elem).click({ force: true });
    });
};

export const confirmInactiveInfotainmentStepDoesNotContainInfotainmentPackage = () => {
    cy.get(e2eChangeSubscriptionPurchaseSelectedInfotainmentPackages).should('not.exist');
};

export const confirmInactiveInfotainmentStepContainsInfotainmentPackageSelected = () => {
    cy.get(e2eChangeSubscriptionPurchaseSelectedInfotainmentPackages).should('exist').should('contain', 'Traffic');
};

export const clickEditOnInfotainmentStep = () => {
    cy.get(e2eChangeSubscriptionPurchaseStepper).find('[data-e2e="AccordionStepper.EditButton"]').eq(1).click({ force: true });
};

export const selectBillingTermAndSubmit = () => {
    cy.get(e2eSelectTermTypeFormMonthlyRadioButton).click();
    cy.get(`${e2eSelectTermTypeForm} button[type=submit]`).click();
};

export const fillOutPaymentFormEmail = () => {
    cy.get(e2ePaymentFormEmailTextfield).type('john.smith@siriusxm.com', { force: true });
};

export const selectPaymentMethodAndSubmit = () => {
    cy.get(e2ePaymentInfoUseExistingCard).click({ force: true });
    cy.get(e2ePaymentConfirmationButton).click();
};

export const confirmOrderSummaryContainsInfotainmentLineItem = () => {
    cy.get('[data-e2e="contentCard.orderDetails.packageName"]').should('contain', 'Traffic');
};

export const confirmOrderSummaryDoesNotContainInfotainmentLineItem = () => {
    cy.get('[data-e2e="contentCard.orderDetails.packageName"]').should('not.contain', 'Traffic');
};

export const submitOrder = () => {
    cy.get(e2eChargeAgreementCheckbox).click({ force: true });
    cy.get(e2eChangeSubscriptionPurchaseSubmitButton).click({ force: true });
};

export const submitChoosePackageStep = () => {
    cy.get(`${e2eMultiPackageSelectionForm} button[type=submit]`).click({ force: true });
};

export const confirmHeaderContainsExpiredOfferError = () => {
    cyGetSxmUiAlertPill().should('contain', 'it looks like this offer has already expired');
};

export const confirmHeaderContainsUpgradedSubscriptionMessage = () => {
    cy.get(e2eHeroComponentHeading).should((elem) => {
        expect(elem).to.contain('upgraded');
    });
};

export const confirmRedirectionToBauLoginPage = () => {
    cy.location().should((loc) => {
        expect(loc.href).to.contain('https://careqa.siriusxm.', 'login_view.action');
    });
};

export const confirmFirstPackageIsPreselected = () => {
    cy.get(e2eOfferCardForm).first().should('exist');
    cy.get(e2eOfferCardFormRadioButton).first().should('be.checked');
};

export const confirmElegibleAudioStepForDataOnly = (options: { expectedFirstPackage: string; expectedSecondPackage: string }) => {
    cy.get(e2eAccordionStepperLabel).eq(0).should('contain', 'Pick your plan');
    cy.get(e2eAccordionStepperContent).should('have.class', 'active');
    cy.get(`${e2eOfferCardForm}:visible`).should('have.length', 2);
    cy.get(e2eOfferCardForm).first().should('contain', options.expectedFirstPackage);
    cy.get(e2eOfferCardForm).eq(1).should('contain', options.expectedSecondPackage);
};

export const confirmInfotainmentStepIsNotPresented = () => {
    cy.get(e2eAccordionStepperLabel).should('not.contain', 'Pick an infotainment package');
};

export const confirmSkipToInfotainmentLinkIsPresented = () => {
    cy.get(e2eChangeSubscriptionPurchaseStepperSkipToInfotainment).should('be.visible');
};

export const confirmInfotainmentStepForDataOnly = () => {
    cy.get(e2eAccordionStepperLabel).eq(1).should('contain', 'Pick an infotainment package');
    cy.get(e2eAccordionStepperContent).should('have.class', 'active');
};
export const confirmInfotainmentStepIsOptional = () => {
    cy.get(e2eAccordionStepperLabel).eq(1).should('contain', '(optional)');
};

export const confirmInfotainmentStepIsNotOptional = () => {
    cy.get(e2eAccordionStepperLabel).eq(1).should('not.contain', '(optional)');
};
