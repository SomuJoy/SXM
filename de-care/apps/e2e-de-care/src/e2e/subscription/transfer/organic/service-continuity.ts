import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountAcscOrganicSuccess, stubAccountWithTrialAndFollowOnSelfPay } from '../../../../support/stubs/de-microservices/account';
import { stubAuthenticateLoginSuccess } from '../../../../support/stubs/de-microservices/authenticate';
import { stubAllPackageDescriptionsSuccess } from '../../../../support/stubs/de-microservices/offers';
import { stubQuotesAcscQuoteOrganicSuccess } from '../../../../support/stubs/de-microservices/quotes';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import { stubUtilitySecurityQuestionsSuccess, stubUtilityCardBinRangesSuccess } from '../../../../support/stubs/de-microservices/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Scenario: Customer can add radio to their account
When(/^a customer navigates to the transfer radio login page and enters in valid info for an account with a trial and follow on$/, () => {
    cy.visit('/transfer/radio/login?intcmp=SXMSimpleHero_NA_www:new-car-transfer-service_LoginOnline');
});
Then(/^they should be able to complete the service continuity flow$/, () => {
    stubAuthenticateLoginSuccess();
    stubAccountWithTrialAndFollowOnSelfPay();
    stubAccountAcscOrganicSuccess();
    cy.get('[data-test="loginFormUsernameField"]').clear({ force: true }).type('promosp@siriusxm.com', { force: true });
    cy.get('[data-test="loginFormPasswordField"]').clear({ force: true }).type('P@ssw0rd!', { force: true });
    cy.get('[data-test="loginFormSubmitButton"]').click();

    stubQuotesAcscQuoteOrganicSuccess();
    cy.get('[data-test="scMethodButton"]').click();
    cy.get('[data-test="transferSubscriptionButton"]').click();

    cy.intercept('POST', '**/services/purchase/service-continuity', { fixture: 'de-microservices/purchase/service-continuity/organic_success.json' });
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="chargeAgreementFormField"]').click({ force: true });
    cy.get('[data-test="reviewCompleteOrderButton"]').click();
});
Then(/^they should land on the thanks page$/, () => {
    cy.url().should('contain', 'transfer/radio/port/thanks');
});
