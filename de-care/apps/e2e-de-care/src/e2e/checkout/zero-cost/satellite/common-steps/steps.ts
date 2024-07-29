import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitZeroCostSatelliteOrganicWithValidPromoCode } from '../common-utils/ui';
import { stubAllPackageDescriptionsSuccess, stubOffersSuccessSatelliteRtpFree, stubValidatePromoCodeSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

When('a customer visits the page with a valid promo code', () => {
    stubValidatePromoCodeSuccess();
    stubAllPackageDescriptionsSuccess();
    stubOffersSuccessSatelliteRtpFree();
    visitZeroCostSatelliteOrganicWithValidPromoCode();
    cy.primaryPackageCardIsVisibleAndContains('SiriusXM Platinum');
});

Then('they should be presented with the general error page', () => {
    cy.url().should('contain', '/error');
});
