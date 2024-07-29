import { Before } from '@badeball/cypress-cucumber-preprocessor';
import { stubUtilityCaptchaNewSuccess, stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubUtilityCaptchaNewSuccess();
});
