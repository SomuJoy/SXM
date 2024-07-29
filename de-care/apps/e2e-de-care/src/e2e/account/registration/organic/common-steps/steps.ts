import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

Then(/^they should land on the device lookup page$/, () => {
    cy.url().should('contain', 'account/registration/lookup');
});
Then(/^they should land on the accounts found results page$/, () => {
    cy.url().should('contain', 'account/registration/verify');
});
