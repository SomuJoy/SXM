import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import {
    checkForHuluHeroHeader,
    checkForHuluPromoDeal,
    checkForHuluPromoDealImageSource,
    checkForHuluPromoDealDescription,
    checkForHiddenHuluPromoDealChannelDescription,
    checkForHuluPromoDealChannelDescription,
    checkForHiddenHuluBottomSection,
    checkForHuluBottomSection,
    clickViewMoreButton
} from '@de-care/de-care-use-cases/checkout/e2e';

Before(() => {
    cy.server();
    mockRouteForAllPackageDescriptions();
});

When('I navigate to the URL with the right programCode', () => {
    cy.visit('/subscribe/checkout/streaming?programCode=USHULUPRERTP3MO1');
});

Then('I should see the Hulu hero header', () => {
    sxmCheckPageLocation('/subscribe/checkout/streaming');
    sxmCheckParams('programCode=USHULUPRERTP3MO1');
    cy.sxmWaitForSpinner();
    checkForHuluHeroHeader();
});

And('I should see a Hulu promo deal card', () => {
    checkForHuluPromoDeal();
    checkForHuluPromoDealImageSource();
    checkForHuluPromoDealDescription();
});

And('The accordion should be collapsed by default', () => {
    checkForHiddenHuluPromoDealChannelDescription();
    checkForHiddenHuluBottomSection();
});

When('I hit the view more button, I should see the hulu promo details', () => {
    clickViewMoreButton();
    checkForHuluPromoDealChannelDescription();
    checkForHuluBottomSection();
});
