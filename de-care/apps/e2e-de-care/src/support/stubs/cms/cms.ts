Cypress.Commands.add('stubCmsCampaignSuccess', () => {
    cy.intercept('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMCampaign*', { fixture: `cms/cms-campaign.json` });
});

Cypress.Commands.add('stubCmsCampaignAssetsSuccess', () => {
    cy.intercept('GET', '**/services/v1/rest/sites/sxm/types/SXMCampaign/assets/*', { fixture: `cms/cms-campaign-assets.json` });
});

Cypress.Commands.add('stubCmsCampaignHeroAssetsSuccess', () => {
    cy.intercept('GET', '**/services/v1/rest/sites/sxm/types/SXMHero/assets/*', { fixture: `cms/cms-campaign-hero-assets.json` });
});

Cypress.Commands.add('stubCmsCampaignHeroAssetsNoBackgroundSuccess', () => {
    cy.intercept('GET', '**/services/v1/rest/sites/sxm/types/SXMHero/assets/*', { fixture: `cms/cms-campaign-hero-assets-no-background.json` });
});

Cypress.Commands.add('stubCmsCampaignHeroAssetImage', () => {
    cy.intercept('GET', '**/content/dam/sxm-com/hero-foreground/talent/MRHH-Hero-FG-BuzzA-DEX-31838-v1.jpg', {
        fixture: `cms/MRHH-Hero-FG-BuzzA-DEX-31838-v1.jpg`,
    });
});

Cypress.Commands.add('stubCmsCampaignHeroAssetBackgroundImage', () => {
    cy.intercept('GET', '**/content/dam/sxm-com/hero-background/concerts/Lifestyle-Hero-1400x600-CrowdHandsLightDots-v1.jpg', {
        fixture: `cms/Lifestyle-Hero-1400x600-CrowdHandsLightDots-v1.jpg`,
    });
});
