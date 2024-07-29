import { And, Then, When, Given } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';
import { stubOffersCustomerCancelSatelliteNewExperience } from '../../../../support/stubs/de-microservices/offers';
import { stubAccountWithSatelliteSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

// Scenario: Experience loads the side to side offers page

Given('the cancel service response is enabling the new offers page experience', () => {
    stubOffersCustomerCancelSatelliteNewExperience();
});
When('a customer navigates to the Cancel subscription experience', () => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithSatelliteSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
    mockAdobeTarget();
    cy.visit('/subscription/cancel?subscriptionId=10000218132');
});

And('selects any cancel reason to continue', () => {
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
});

Then('the app should load the side to side offers page', () => {
    cy.get('[data-test="SideToSideOffersPage"]').should('exist');
});

// Scenario: Experience loads the plan comparison grid modal

And('clicks on the compare the offers link', () => {
    cy.get('[data-test="PlanComparisonGridLink"]').click();
});

Then('the experience displays the plan comparison grid', () => {
    cy.get('[data-test="PlanComparisonGrid"]').should('exist');
});
