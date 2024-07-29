import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    allPackageDescriptionsEn: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/all-package-descriptions-en.json'),
    allPackageDescriptionsFr: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/all-package-descriptions-fr.json'),
    account: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/package-upgrade-account.json'),
    offers: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/customer-offers.json'),
    quote: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/quote.json'),
    captchaFalse: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted-canada/captcha-false.json'),
};

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.intercept('POST', '**/offers/all-package-desc', (routeData) => {
        console.log('routeData', routeData?.body);
        return routeData?.body?.locale === 'fr_CA' ? mockResponses.allPackageDescriptionsFr : mockResponses.allPackageDescriptionsEn;
    });
});

Given(/^an eligible customer visits the page with the program code CAUPM3MOAAFREE$/, () => {
    cy.viewport(900, 1200);
    cy.route('POST', '**/account/token/pkg-upgrade', mockResponses.account);
    cy.route('POST', '**/offers/customer', mockResponses.offers);
    cy.visit('http://localhost:4201/subscribe/checkout/upgrade/tier-up/targeted?tkn=24b3d7cc-7372-4e7a-8098-68db0ae6ee79&programcode=CAUPM3MOAAFREE');
});
Then(/^they should be presented with the correct upgrade offer$/, () => {
    cy.get('sxm-ui-content-card').should('be.visible');
});
And(/^the language toggle should be present in the header$/, () => {
    cy.get('[data-language-toggle]').should('be.visible');
});
