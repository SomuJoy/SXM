// TODO: re-create this in apps/de-care-e2e/src/integration/features/smoke-test/checkout/streaming/organic
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    allPackageDescriptions: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/all-package-descriptions.json'),
    updateUseCase: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/update-usecase.json'),
    offers: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers.json'),
    offersInfo: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-info.json'),
    cmsCampaign: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/cms-campaign.json'),
    cmsCampaignAssets: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/cms-campaign-assets.json'),
    cmsCampaignHeroAssets: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/cms-campaign-hero-assets.json'),
    cmsCampaignHeroAssetsNoBackground: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/cms-campaign-hero-assets-no-background.json'),
};

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.route('POST', '**/offers/all-package-desc', mockResponses.allPackageDescriptions);
    cy.route('POST', '**/apigateway/update-usecase', mockResponses.updateUseCase);
    cy.route('POST', '**/offers', mockResponses.offers);
    cy.route('POST', '**/offers/info', mockResponses.offersInfo);
});

Given(/^a customer visits the page with utm_content for a campaign id string that is not valid$/, () => {
    cy.route({ method: 'GET', url: '**/phx/services/v1/rest/sites/sxm/types/SXMCampaign*', status: 404 });
    cy.viewport(900, 1200);
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=invalid');
});
Then(/^they should be presented with the correct offer without any UI error for missing campaign content$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent img').should('not.exist');
    });
});

Given(/^a customer visits the page with utm_content for a campaign id string that is valid$/, () => {
    cy.route('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMCampaign*', mockResponses.cmsCampaign);
    cy.route('GET', '**/services/v1/rest/sites/sxm/types/SXMCampaign/assets/*', mockResponses.cmsCampaignAssets);
    cy.route('GET', '**/services/v1/rest/sites/sxm/types/SXMHero/assets/*', mockResponses.cmsCampaignHeroAssets);
    cy.viewport(900, 1200);
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=Music-Rock-DavidBowie-TheDavidBowieChannel');
});
Then(/^they should be presented with campaign content$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent').should('have.css', 'background-image').and('not.eq', 'none');
        cy.get('#heroContent img').should('exist');
    });
});

Given(/^a customer visits the page with utm_content for a campaign id string that is valid and the campaign does not have a background image$/, () => {
    cy.route('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMCampaign*', mockResponses.cmsCampaign);
    cy.route('GET', '**/services/v1/rest/sites/sxm/types/SXMCampaign/assets/*', mockResponses.cmsCampaignAssets);
    cy.route('GET', '**/services/v1/rest/sites/sxm/types/SXMHero/assets/*', mockResponses.cmsCampaignHeroAssetsNoBackground);
    cy.viewport(900, 1200);
    cy.visit('/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&utm_content=Music-Rock-DavidBowie-TheDavidBowieChannel');
});
Then(/^they should be presented with campaign content and the hero should not have a background image$/, () => {
    cy.wait(2000).then(() => {
        cy.get('#heroContent').should('have.css', 'background-image', 'none');
        cy.get('#heroContent img').should('exist');
    });
});
