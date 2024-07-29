import { mockDefaultOfferForInvalidProgramCode } from '@de-care/de-care-use-cases/checkout/e2e';
import { sxmCheckPageLocation, sxmEnsureNoMissingTranslations, sxmWaitForSpinner } from '@de-care/shared/e2e';
import { cyGetSxmUiAlertPill } from '@de-care/shared/sxm-ui/e2e';
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('the customer navigates into PHX with an invalid program code', () => {
    mockDefaultOfferForInvalidProgramCode();
    cy.visit('/?programcode=invalid');
    sxmWaitForSpinner();
});

Then('they should see the alert pill for invalid code', () => {
    sxmCheckPageLocation('/subscribe/checkout/flepz');
    sxmEnsureNoMissingTranslations();

    cyGetSxmUiAlertPill().should('contain', 'we are having issues fulfilling this request');
});
