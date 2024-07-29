import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess } from '../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubAllPackageDescriptionsSuccess();
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    cy.visit('/transfer/radio/login?intcmp=SXMSimpleHero_NA_www:new-car-transfer-service_LoginOnline');
});
