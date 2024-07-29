import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';
import { stubAccountWithStreamingSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithStreamingSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [] }]);
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
});
