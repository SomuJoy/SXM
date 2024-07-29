import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubCookieLaw } from '../../support/stubs/common';
import { expectDigitalDataToBeAnObject } from '../common-utils/digital-data';
import { stubUtilityEnvInfoSuccess, stubUtilityLogMessageSuccess } from '../../support/stubs/de-microservices/utility';

Before(() => {
    // stub the Accept Cookies UI
    stubCookieLaw();

    // The de-care app makes an initial call to env-info before loading any features
    stubUtilityEnvInfoSuccess();
    stubUtilityLogMessageSuccess();
});

// Analytics
Then(/^the Window object should have a property named digitalData set to an object$/, () => {
    expectDigitalDataToBeAnObject();
});
