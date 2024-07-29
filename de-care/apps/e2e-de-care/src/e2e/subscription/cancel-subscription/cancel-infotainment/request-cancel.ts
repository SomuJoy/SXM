import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';

import { stubOffersCustomerCancelStreamingWithPlatinum } from '../../../../support/stubs/de-microservices/offers';
import { stubAccountWithInfotainmentSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubCancelSubscriptionComplete } from '../../../../support/stubs/de-microservices/purchase';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithInfotainmentSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [] }]);
});

//Scenario: Customer completes the cancelation preprocess
When(/^a customer goes through cancellation process$/, () => {
    stubOffersCustomerCancelStreamingWithPlatinum();
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
    stubCancelSubscriptionComplete();
    cy.get('[data-test="cancelPlanButton"]').click();
});
Then(/^navigates to the Cancel summary step$/, () => {
    cy.get('[data-test="planToCancelInfo"]').should('exist');
    cy.get('[data-test="cancelSummaryBulletList"]').should('not.exist');
});
