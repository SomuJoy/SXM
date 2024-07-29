import {
    cyGetDefaultOfferV1Hero,
    cyGetDefaultOfferV1OfferDetails,
    cyGetDefaultOfferV2Hero,
    mockDefaultOfferForExpiredProgramCode,
    mockDefaultOfferForInvalidProgramCode,
    mockDefaultOfferForValidProgramCode
} from '@de-care/de-care-use-cases/checkout/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmEnsureNoMissingTranslations, sxmWaitForSpinner } from '@de-care/shared/e2e';
import { cyGetSxmUiAlertPill } from '@de-care/shared/sxm-ui/e2e';
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a satellite customer', () => {
    cy.server();
    mockRouteForAllPackageDescriptions();
    mockRouteForCardBinRanges();
});

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

When('the customer navigates into PHX with a valid program code', () => {
    mockDefaultOfferForValidProgramCode();
    cy.visit('/?programcode=6FOR30SELECT');
    sxmWaitForSpinner();
});

Then('they should see the old experience', () => {
    sxmCheckPageLocation('/subscribe/checkout/flepz');
    sxmEnsureNoMissingTranslations();

    cyGetSxmUiAlertPill().should('not.be.visible');
    cyGetDefaultOfferV1OfferDetails().should('be.visible');
});

When('the customer navigates into PHX with an expired program code', () => {
    mockDefaultOfferForExpiredProgramCode();
    cy.visit('/?programcode=EXP');
    sxmWaitForSpinner();
});

Then('they should see the alert pill for expired code', () => {
    sxmCheckPageLocation('/subscribe/checkout/flepz');
    sxmEnsureNoMissingTranslations();

    cyGetSxmUiAlertPill().should('contain', 'it looks like this offer has already expired');
});
