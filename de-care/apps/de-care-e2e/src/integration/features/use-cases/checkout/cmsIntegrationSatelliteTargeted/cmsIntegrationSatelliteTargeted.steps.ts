import {
    mockRouteForDeviceValidate,
    mockRouteForNonPii,
    mockRouteForOffersCustomer,
    mockRouteForOffersInfo,
    mockRouteForOffersUpsell,
    mockRouteForUpsellOffersInfo
} from '@de-care/de-care-use-cases/checkout/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForEnvInfo();
    mockRouteForAllPackageDescriptions();
});

Given(/^a targeted customer visits the satellite checkout URL$/, () => {
    mockRouteForDeviceValidate();
    mockRouteForNonPii();
    mockRouteForOffersCustomer();
    mockRouteForOffersInfo();
    mockRouteForOffersUpsell();
    mockRouteForUpsellOffersInfo();
    cy.visit('/subscribe/checkout?programcode=6for30select&radioid=X65100AR&act=7853');
});
Then(/^the hero should be correct$/, () => {
    // assert hero copy matches legacy copy
});
Then(/^the lead offer card should be correct$/, () => {
    // assert lead offer card copy matches legacy copy
});
Then(/^the upsell options should be correct$/, () => {
    // navigate to upsells step and confirm upsells copy matches legacy copy
    // select different upsells and confirm dynamic changing copy matches legacy copy
});
