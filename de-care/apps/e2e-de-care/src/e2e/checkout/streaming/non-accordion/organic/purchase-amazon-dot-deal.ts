import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { visitCheckoutOrganicWithAllowedProgramCode } from '../common-utils/ui';
import { stubOffersSuccessDigitalPlatinumWithEchoDotDeal } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalPlatinumWithEchoDotDeal();
});

When('a customer goes through the organic streaming purchase steps with an offer with Amazon dot deal', () => {
    visitCheckoutOrganicWithAllowedProgramCode();
});

Then('they should land in the offer page and see the expected lead offer', () => {
    cy.get('step-organic-offer-presentment-page').should('be.visible');
    cy.packageCardBasicIsVisibleAndContains(['SiriusXM Streaming Platinum', 'SAVE 25% • CANCEL ONLINE ANYTIME']);
});

Then('they should be presented with the deal offer', () => {
    cy.productBannerIsVisibleAndContains(['Receive an Echo Dot (4th generation) on us']);
});

Then('they should see the expected features list', () => {
    cy.featuresListIsVisibleAndContains(['SiriusXM Streaming Platinum Includes:']);
});
