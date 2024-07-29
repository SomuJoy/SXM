import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubAllPackageDescriptionsSuccess();
});

Then('they should land on the confirmation page', () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic/thanks');
});

Then('they should be presented with a fallback offer', () => {
    cy.wait(5000).then(() => {
        cy.get('step-organic-review-page sxm-ui-alert-pill').should('be.visible');
        cy.get('step-organic-review-page sxm-ui-plan-recap-card').should('be.visible');
    });
});
