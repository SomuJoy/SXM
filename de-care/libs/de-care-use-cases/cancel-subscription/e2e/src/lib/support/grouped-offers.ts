import { e2eGroupedOfferCardFormField } from '@de-care/domains/offers/ui-grouped-offer-card-form-field';
import { submitChangePlanOption } from './helpers';

const e2eGroupedOfferCardFormFieldPlanOption = '[data-e2e="groupedOfferCardFormField.planOptions"] input[type="radio"]';

export function confirmSinglePackageCardForChoiceOffers(): void {
    cy.get(e2eGroupedOfferCardFormField)
        .first()
        .should('be.visible');
}

export function confirmChoiceOfferPackageCardHasOptions(): void {
    cy.get(e2eGroupedOfferCardFormFieldPlanOption).should('be.visible');
}

export function selectChoicePackageOptionAndSubmit(): void {
    cy.get(e2eGroupedOfferCardFormFieldPlanOption)
        .first()
        .click({ force: true });
    submitChangePlanOption();
}
