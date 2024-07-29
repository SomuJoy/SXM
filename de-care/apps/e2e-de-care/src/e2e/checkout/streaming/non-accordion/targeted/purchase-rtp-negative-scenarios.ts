import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialSubscription } from '../../../../../support/stubs/de-microservices/account';
import { stubAllPackageDescriptionsSuccess, stubOffersCustomerStreamingNonAccordionTargetedIneligible } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubAllPackageDescriptionsSuccess();
    stubUtilityEnvInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    cy.viewport('iphone-x');
});

// Scenario: Experience handles not eligible for RTP conversion
When(/^a trial RTP customer that is not eligible visits the targeted streaming purchase experience$/, () => {
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialSubscription();
    stubOffersCustomerStreamingNonAccordionTargetedIneligible();
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted?token=VALID_TOKEN&programcode=USDOTPRERTPO2O12MO99G4`);
});
Then(/^they should be presented with the generic error page$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/generic-error');
});
