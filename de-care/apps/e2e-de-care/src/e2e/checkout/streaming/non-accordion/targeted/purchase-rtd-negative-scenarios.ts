import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitCheckoutTargetedRtdWithAllowedProgramCode } from './common-utils/ui';
import { stubAccountTokenStreamingNonAccordionTargetedSingleDigitalSelfPaySubscription } from '../../../../../support/stubs/de-microservices/account';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerStreamingNonAccordionTargetedEssentialStreamingMonthly,
    stubOffersInfoStreamingNonAccordionTargetedEssentialStreamingMonthly,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubAllPackageDescriptionsSuccess();
    stubUtilityEnvInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    cy.viewport('iphone-x');
});

// Scenario: Experience handles not eligible for RTP conversion
When(/^a self paid customer that is not eligible visits the targeted streaming purchase experience$/, () => {
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalSelfPaySubscription();
    stubOffersCustomerStreamingNonAccordionTargetedEssentialStreamingMonthly();
    stubOffersInfoStreamingNonAccordionTargetedEssentialStreamingMonthly();
    visitCheckoutTargetedRtdWithAllowedProgramCode();
});
Then(/^they should be presented with the "you already have a subscription error page"$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/you-already-have-a-subscription-error');
});
