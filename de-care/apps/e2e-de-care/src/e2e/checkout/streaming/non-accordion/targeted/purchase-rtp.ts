import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialNoFollowOnSubscription } from '../../../../../support/stubs/de-microservices/account';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerStreamingNonAccordionTargetedPlatinumWithEchoDotDeal,
    stubOffersInfoStreamingNonAccordionTargetedStreamingPlatinumWithEchoDotDeal,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubAllPackageDescriptionsSuccess();
    stubUtilityEnvInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    cy.viewport('iphone-x');
});

// Scenario: Existing customer with trial RTP is presented offer and deal
When(/^a trial RTP customer visits the targeted streaming purchase experience for an offer with amazon dot deal$/, () => {
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialNoFollowOnSubscription();
    stubOffersCustomerStreamingNonAccordionTargetedPlatinumWithEchoDotDeal();
    stubOffersInfoStreamingNonAccordionTargetedStreamingPlatinumWithEchoDotDeal();
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted?token=VALID_TOKEN&programcode=USDOTPRERTPO2O12MO99G4`);
});
Then(/^they should be presented with the lead offer$/, () => {
    cy.get('step-offer-presentment-page').should('be.visible');
    cy.packageCardBasicIsVisibleAndContains(['SiriusXM Streaming Platinum', 'SAVE 25% • CANCEL ONLINE ANYTIME']);
});
Then(/^they should be presented with the deal offer$/, () => {
    cy.productBannerIsVisibleAndContains(['Receive an Echo Dot (4th generation) on us']);
});

Then('they should see the expected features list', () => {
    cy.featuresListIsVisibleAndContains(['SiriusXM Streaming Platinum Includes:']);
});
