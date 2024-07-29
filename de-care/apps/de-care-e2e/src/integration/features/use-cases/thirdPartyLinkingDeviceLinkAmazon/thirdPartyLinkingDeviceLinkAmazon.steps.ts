import { Given, When, Then, And, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import {
    confirmAmazonLoginProcessStarted,
    confirmDeviceLinkAmazonErrorPage,
    confirmDeviceLinkAmazonSuccessPage,
    confirmGenericErrorPage,
    confirmLandingPageShowsPendingActionMessage,
    confirmLandingPageShowsRedirectMessage,
    mockAmazonPageSuccess,
    mockRouteForDeviceLinkFail,
    mockRouteForDeviceLinkSuccess,
    simulateWait
} from '@de-care/de-care-use-cases/third-party-linking/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForEnvInfo();
    mockRouteForDeviceLinkSuccess();
});

Given('the customer visits the link Amazon device URL', () => {
    cy.visit('/subscribe/linking/device-link-amazon?subscriptionId=1000', {
        onBeforeLoad(win) {
            mockAmazonPageSuccess(win);
        }
    });
});

Then('they should immediately see the message about being redirected', () => {
    confirmLandingPageShowsRedirectMessage();
});

When('they have been on the page for a few seconds', () => {
    simulateWait();
});
Then('the landing page should display the redirect updated message', () => {
    confirmLandingPageShowsPendingActionMessage();
});
And('a new tab should open with the Amazon login page', () => {
    confirmAmazonLoginProcessStarted();
});

When('the customer successfully logs into their Amazon account', () => {
    // TODO: mock the external link call and event callback that happens on success
});
And('the attempt to link on the SiriusXM side fails', () => {
    mockRouteForDeviceLinkFail();
});
Then('the customer should see the error page', () => {
    confirmDeviceLinkAmazonErrorPage();
});

When('they successfully link their device', () => {
    // TODO: mock the external link call and event callback that happens on success
    mockRouteForDeviceLinkSuccess();
});
Then('they should see the success page', () => {
    confirmDeviceLinkAmazonSuccessPage();
});

Given('the customer visits the link Amazon device URL with out a subscription id', () => {
    cy.visit('/subscribe/linking/device-link-amazon');
});

Then('they should be navigated to the general error page for the app', () => {
    confirmGenericErrorPage();
});
