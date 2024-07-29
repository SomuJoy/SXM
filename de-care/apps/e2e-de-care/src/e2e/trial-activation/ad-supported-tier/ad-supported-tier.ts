import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubUtilityCardBinRangesSuccess } from '../../../support/stubs/de-microservices/utility';
import { stubAllPackageDescriptionsSuccess } from '../../../support/stubs/de-microservices/offers';
import { startMyTrialUpdateUsecaseSuccess } from '../../checkout/streaming/common-utils/stubs';
import { stubPurchaseTrialActivationLastOneClick, stubPurchaseTrialActivationLastOneClickError } from '../../../support/stubs/de-microservices/purchase';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    startMyTrialUpdateUsecaseSuccess();
    cy.viewport('iphone-x');
});

When(/^they hit LAST url$/, () => {
    cy.visit(`/activate/trial/ast?token=45834f85-1201-4d6d-b21c-ff0b9f570d84`);
});

// Scenario: Ad supported tier correct activation
Given(/^A customer with a closed SiriusXM Trial Radio attempts to activate$/, () => {
    stubPurchaseTrialActivationLastOneClick();
});
Then(/^they should see LAST confirmation page$/, () => {
    cy.url().should('contain', '/activate/trial/ast/ast-activated');
    cy.get('[data-test="ConfirmationPage"]').first().should('be.visible');
});

// Scenario: Ad supported tier already active
Given(/^An already activated customer looking for activating the ad supported tier$/, () => {
    stubPurchaseTrialActivationLastOneClickError();
});
Then(/^they should see core error 500 page$/, () => {
    cy.url().should('contain', '/error');
});
