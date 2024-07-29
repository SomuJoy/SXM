import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubOffersSuccessDigitalPromoFallback,
    stubOffersSuccessDigitalPromoFallbackExpired,
    stubOffersSuccessDigitalPromoFallbackReasonOthers,
} from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    cy.viewport('iphone-x');
});

Given(/^a customer visits the page with a program code for an offer no longer available$/, () => {
    stubOffersSuccessDigitalPromoFallback();
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE`);
});
Then(/^they should be presented with the no longer available finding another offer messaging before seeing a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('be.visible');
    cy.get('sxm-ui-loading-with-alert-message sxm-ui-alert-pill').should('contain.text', 'available');
    cy.wait(5000).then(() => {
        cy.get('sxm-ui-primary-package-card').should('be.visible');
    });
});

Given(/^a customer visits the page with a program code for an expired offer$/, () => {
    stubOffersSuccessDigitalPromoFallbackExpired();
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE`);
});
Then(/^they should be presented with the finding another offer messaging before seeing a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('not.exist');
    cy.url().should('match', /expired-offer-error$/);
});

Given(/^a customer visits the page without a program code$/, () => {
    stubOffersSuccessDigitalPromoFallback();
    cy.visit(`/subscribe/checkout/purchase/streaming/organic`);
});

Then(/^they should be presented with fallback offer, with out any alert message about a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('not.exist');
    cy.get('sxm-ui-primary-package-card').should('be.visible');
});

Given(/^a customer visits the page with an invalid programcode$/, () => {
    stubOffersSuccessDigitalPromoFallbackReasonOthers();
    // we need to use a valid one for now then forcing MS to tell the app the programcode is not valid
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=STREAM4MO99`);
});
Then(/^they should be presented with the finding another offer for non valid program code messaging before seeing a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('be.visible');
    cy.get('sxm-ui-loading-with-alert-message sxm-ui-alert-pill').should('contain.text', 'available');
    cy.wait(5000).then(() => {
        cy.get('sxm-ui-primary-package-card').should('be.visible');
    });
});
