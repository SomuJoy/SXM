import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountTokenStreamingNonAccordionTargetedNoSubscriptionsAndNotRegistered } from '../../../../../support/stubs/de-microservices/account';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersInfoStreamingNonAccordionTargetedStreamingPlatinumWithEchoDotDeal,
    stubOffersStreamingNonAccordionOrganicPlatinumWithEchoDotDeal,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubAllPackageDescriptionsSuccess();
    stubUtilityEnvInfoSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    cy.viewport('iphone-x');
});

// Scenario: Customer is redirected to organic checkout experience when not registered
When(/^a customer without an active subscription and account is not registered visits the targeted streaming purchase experience$/, () => {
    stubAccountTokenStreamingNonAccordionTargetedNoSubscriptionsAndNotRegistered();
    stubOffersStreamingNonAccordionOrganicPlatinumWithEchoDotDeal();
    stubOffersInfoStreamingNonAccordionTargetedStreamingPlatinumWithEchoDotDeal();
    cy.visit(`/subscribe/checkout/purchase/streaming/targeted?token=VALID_TOKEN&programcode=USDOTPRERTPO2O12MO99G4`);
});
Then(/^they should be redirected to the organic checkout experience$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic');
});
