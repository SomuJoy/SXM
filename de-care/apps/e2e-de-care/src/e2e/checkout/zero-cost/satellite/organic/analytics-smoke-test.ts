import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitZeroCostSatelliteOrganicWithValidPromoCode } from '../common-utils/ui';
import { stubAllPackageDescriptionsSuccess, stubOffersSuccessSatelliteRtpFree, stubValidatePromoCodeSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    stubValidatePromoCodeSuccess();
    stubAllPackageDescriptionsSuccess();
    stubOffersSuccessSatelliteRtpFree();
    visitZeroCostSatelliteOrganicWithValidPromoCode();
});
