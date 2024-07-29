import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Experience gracefully falls back when campaign content is not found
When(/^a customer visits the page with utm_content for a campaign id string that is not valid$/, () => {
    cy.intercept('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMCampaign*', { statusCode: 404 });
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=invalid');
});
Then(/^they should be presented with the correct offer without any UI error for missing campaign content$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent img').should('not.exist');
    });
});

// Scenario: Experience loads with campaign content
When(/^a customer visits the page with utm_content for a campaign id string that is valid$/, () => {
    cy.stubCmsCampaignSuccess();
    cy.stubCmsCampaignAssetsSuccess();
    cy.stubCmsCampaignHeroAssetsSuccess();
    cy.stubCmsCampaignHeroAssetImage();
    cy.stubCmsCampaignHeroAssetBackgroundImage();
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=Music-Rock-DavidBowie-TheDavidBowieChannel');
});
Then(/^they should be presented with campaign content$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent').should('have.css', 'background-image').and('not.eq', 'none');
        cy.get('#heroContent img').should('exist');
    });
});

// Scenario: Experience loads with campaign content with no background image
When(/^a customer visits the page with utm_content for a campaign id string that is valid and the campaign does not have a background image$/, () => {
    cy.stubCmsCampaignSuccess();
    cy.stubCmsCampaignAssetsSuccess();
    cy.stubCmsCampaignHeroAssetsNoBackgroundSuccess();
    cy.stubCmsCampaignHeroAssetImage();
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=Music-Rock-DavidBowie-TheDavidBowieChannel');
});
Then(/^they should be presented with campaign content and the hero should not have a background image$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent').should('have.css', 'background-image', 'none');
        cy.get('#heroContent img').should('exist');
    });
});
