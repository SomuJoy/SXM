import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
});

Given('a user is redirected to the checkout streaming ineligible redirect route with an error code in the url', () => {
    cy.visit('/subscribe/checkout/streaming/ineligible-redirect?errorCode=3494');
});

When('the loading overlay appears', () => {
    cy.get('sxm-ui-alert-pill').should('exist');
    cy.get('sxm-ui-loading-overlay').should('exist');
});

Then('copy displays in the overlay and pill', () => {
    cy.get('sxm-ui-alert-pill > p').within((text) => {
        const copyString = text['0'].innerText as string;
        expect(copyString.indexOf('checkout') === -1).true;
    });
    cy.get('sxm-ui-loading-overlay').within((text) => {
        const copyString = text['0'].innerText as string;
        expect(copyString.indexOf('checkout') === -1).true;
    });
});

Given('a user is redirected to the FLEPZ streaming ineligible redirect route with an error code in the url', () => {
    cy.visit('/subscribe/checkout/flepz/ineligible-redirect?errorCode=3494');
});

When('the loading overlay appears', () => {
    cy.get('sxm-ui-alert-pill').should('exist');
    cy.get('sxm-ui-loading-overlay').should('exist');
});

Then('copy displays in the overlay and pill', () => {
    cy.get('sxm-ui-alert-pill > p').within((text) => {
        const copyString = text['0'].innerText as string;
        expect(copyString.indexOf('checkout') === -1).true;
    });
    cy.get('sxm-ui-loading-overlay').within((text) => {
        const copyString = text['0'].innerText as string;
        expect(copyString.indexOf('checkout') === -1).true;
    });
});
