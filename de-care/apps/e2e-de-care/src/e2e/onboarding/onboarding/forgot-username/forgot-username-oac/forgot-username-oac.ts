import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutResetUsernameFormAndSubmit, forgotUsernameUrl, getUserNameButton } from '../common-utils/ui';
import { stubAccountCredentialRecoveryUsernameSendEmailSuccess } from '../../../../../support/stubs/de-microservices/account';
import { stubAccountRegistrationNonPiiSuccessNoData } from '../../../../../support/stubs/de-microservices/account';
import { identityCustomerCredentialRecoverySuccess } from '../../../../../support/stubs/de-microservices/identity';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});
//Scenario: Customer should get to forgot  page when click on forgot password
When(/^they update the reset username form$/, () => {
    forgotUsernameUrl();
    identityCustomerCredentialRecoverySuccess();
    fillOutResetUsernameFormAndSubmit();
});
Then(/^they should land on the multiple username landing page$/, () => {
    cy.get('[data-test="getUsernameLink"]').should('exist');
});
// Scenario: Customer should be able to get the username confirmation screen
Then(/^when they click on get username cta$/, () => {
    stubAccountCredentialRecoveryUsernameSendEmailSuccess();
    stubAccountRegistrationNonPiiSuccessNoData();
    getUserNameButton();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/forgot-username-mail-sent-confirmation?src=oac');
});
