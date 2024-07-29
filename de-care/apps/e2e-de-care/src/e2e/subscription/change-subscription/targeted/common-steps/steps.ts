import { Before } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
});
