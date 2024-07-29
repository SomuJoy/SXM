import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubOffersSuccessSatellitePromoSelfPay } from '../../../../../support/stubs/de-microservices/offers';

import {
    completeChangePlatformCheckout,
    verifyFlepzOnSiriusPlatform,
    verifyLicensePlateAndLpzOnSiriusPlatform,
    verifyRadioIdAndLpzOnSiriusPlatform,
    verifyRadioIdAndLpzOnSiriusPlatformAndConfirmChange,
    verifyVinAndLpzOnSiriusPlatform,
    visitFlepz,
} from '../common-utils/ui';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});

Given(/^a customer visits the organic satellite purchase experience with an program code for a SiriusXM platform offer$/, () => {
    visitFlepz();
});

// Scenario: Customer is presented with the change platform notice when identifying with a radio id
When(/^they identify using a radio id for a device that is not on the SiriusXM platform$/, () => {
    verifyRadioIdAndLpzOnSiriusPlatform();
});

// Scenario: Customer is presented with the change platform notice when identifying with a VIN
When(/^they identify using a VIN for a device that is not on the SiriusXM platform$/, () => {
    verifyVinAndLpzOnSiriusPlatform();
});

// Scenario: Customer is presented with the change platform notice when identifying with a license plate
When(/^they identify using a license plate for a device that is not on the SiriusXM platform$/, () => {
    verifyLicensePlateAndLpzOnSiriusPlatform();
});

// Scenario: Customer is presented with the change platform notice when identifying with FLEPZ
When(/^they identify using FLEPZ for a device that is not on the SiriusXM platform$/, () => {
    verifyFlepzOnSiriusPlatform();
});

Then(/^they should be presented with the change platform notice$/, () => {
    const siriusExcludes = cy.get('[data-test="siriusExcludes"]');

    siriusExcludes.should('exist');
    siriusExcludes.should('include.text', 'Sirius radio');
    siriusExcludes.should('include.text', 'compatible');
});

//Scenario: Customer is presented with a new lead offer based on platform change
When(/^they identify using a radio id for a device that is not on the SiriusXM platform and confirm the change platform notice$/, () => {
    verifyRadioIdAndLpzOnSiriusPlatformAndConfirmChange();
});
Then(/^they should be presented with a new lead offer for the platform$/, () => {
    cy.get('[data-test="BetterPricing"]').should('exist');
    cy.get('sxm-ui-primary-package-card').should('be.visible').should('contain', 'Sirius Music & Entertainment');
});

// Scenario: Customer can purchase an offer based on platform change
When(/^they identify using a radio id for a device that is not on the SiriusXM platform and complete the transaction$/, () => {
    verifyRadioIdAndLpzOnSiriusPlatformAndConfirmChange();
    completeChangePlatformCheckout();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
    cy.get('order-summary-promo-renewal-quote').should('be.visible').should('contain', 'Sirius Music & Entertainment');
});
