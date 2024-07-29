import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubCustomerOffersAndSiteVisit } from './common-utils/ui';
import { stubAccountNonPiiSatelliteTargetedClosedRadioWithYmm } from '../../../../../support/stubs/de-microservices/account';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubDeviceValidateNewSuccess();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithYmm();
    stubCustomerOffersAndSiteVisit();
});
