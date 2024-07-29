import { Given, And, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockRTPAPICalls, fillOutYourInfoAndPayment, reviewAndSubmit } from '../rtp-helpers';

Before(() => {
    mockRTPAPICalls();
});

Given('a customer enters the RTP streaming flow', () => {
    cy.visit(
        '/activate/trial/rtp?radioId=0375&usedCarBrandingType=OTHERS&programCode=3MOAA99&redirectUrl=https:%2F%2Fdex-dev.corp.siriusxm.com%2Fdvgllvdexoac03-17324-care%2F%3Fprogramcode%3D3MOAA99'
    );
});

And('the customer is eligible', () => {
    cy.get('h4').should('have.text', ` You're eligible `);
});

When('the customer fills out the payment info', () => {
    fillOutYourInfoAndPayment();
});

Then('they can checkout with a new trial subscription', () => {
    cy.url().should('contain', '/activate/trial/rtp/review');
    reviewAndSubmit();
    cy.url().should('contain', '/activate/trial/rtp/thanks');
});
