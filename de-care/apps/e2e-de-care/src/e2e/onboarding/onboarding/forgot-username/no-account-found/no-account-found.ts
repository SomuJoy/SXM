import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutResetUsernameFormAndSubmit, forgotUsernameUrl, noAccountSentPage } from '../common-utils/ui';
import { identityCustomerCredentialRecoveryForNoAccount } from '../../../../../support/stubs/de-microservices/identity';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Scenario: Customer should be redirected to account not found when it has no results
When(/^a user visits the forgot user name page and submits data that results in no account found$/, () => {
    forgotUsernameUrl();
    identityCustomerCredentialRecoveryForNoAccount();
    fillOutResetUsernameFormAndSubmit();
    noAccountSentPage();
});
Then(/^they should land on the account not found page$/, () => {
    cy.get('[data-test="radioId"]').should('exist');
});
