// TODO: refactor these to get selectors from .e2e.ts files next to components

import { e2ePaymentConfirmationButton, e2ePaymentInfoUseExistingCard } from '@de-care/customer-info';
import { e2eMultiPackageSelectionForm } from '@de-care/offers';
import { e2eChargeAgreementCheckbox } from '@de-care/review-order';
import { e2eAcceptOfferCompleteMyOrderButton } from '@de-care/de-care-use-cases/cancel-subscription/feature-cancel-request';

export function selectCancelReasonAndSubmit(): void {
    cy.get('de-care-cancel-reason form input[type=radio]+label')
        .first()
        .click();
    // TODO: looks like cancel reason component has an expressionChangedAfter issue that can be seen if using submit
    //       but not when trying to find button and clicking...probably due to the short delay allowing for CD zone tick to occur
    //       We should fix that component and can use this to confirm the fix
    // cy.get('[data-e2e=cancelReasonForm]').submit();
    cy.get('[data-e2e=cancelReasonForm] button[type=submit]').click();
}

export function submitChangePlanOption() {
    cy.get(e2eMultiPackageSelectionForm).submit();
}

export function selectChangePlanOptionAndSubmit(index: number) {
    cy.get(`${e2eMultiPackageSelectionForm} input[type=radio]+label`)
        .eq(index)
        .click({ force: true });
    submitChangePlanOption();
}

export function selectBillingTermOptionAndSubmit(index: number) {
    cy.get('[data-e2e="cancellationBillingTermForm"] input[type=radio]+label')
        .eq(index)
        .click();
    cy.get('[data-e2e="cancellationBillingTermForm"] button[type=submit]').click();
}

export function selectFirstBillingTermOptionAndSubmit(): void {
    selectBillingTermOptionAndSubmit(0);
}

export function assertBillingTermStepInActiveText(text: string): void {
    cy.get('[data-e2e="cancellationBillingTermsStepContent"]').should(elem => expect(elem.text().trim()).to.equal(text));
}

export function selectUseExistingCardPaymentMethodAndSubmit(): void {
    cy.get(e2ePaymentInfoUseExistingCard).click({ force: true });
    cy.get(e2ePaymentConfirmationButton).click({ force: true });
}

export function submitReviewAndSubmitStep(): void {
    cy.get(e2eChargeAgreementCheckbox).click({ force: true });
    cy.get(e2eAcceptOfferCompleteMyOrderButton).click({ force: true });
}
