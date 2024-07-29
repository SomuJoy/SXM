import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../support/stubs/de-microservices/offers';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess, stubUtilitySecurityQuestionsSuccess } from '../../../support/stubs/de-microservices/utility';
import { stubTrialActivationServiceLaneOneClickWithToken } from '../../../support/stubs/de-microservices/trial';
import { stubAccountNonPiiServiceLaneOneClickTrialActivation } from '../../../support/stubs/de-microservices/account';

const token = '80a93356-4aaa-4d8f-8f48-b8c2c61b539b';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
});

// Scenario: Service lane one click new vehicle
Given(/^A customer with trial attempts to activate that trial$/, () => {
    stubTrialActivationServiceLaneOneClickWithToken(token);
    stubAccountNonPiiServiceLaneOneClickTrialActivation();
    stubUtilitySecurityQuestionsSuccess();
});
When(/^they navigate to the service lane one click url$/, () => {
    cy.visit('/subscribe/oneclick?cna_id=80a93356-4aaa-4d8f-8f48-b8c2c61b539b');
});
Then(/^they should see the confirmation page$/, () => {
    cy.get('service-lane-one-click-confirmation').should('exist');
});
