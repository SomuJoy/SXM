import { stubOffersCustomerChangeOrganicMultiple, stubOffersInfoChangeSubscriptionOrganicMultiple } from '../../../../../support/stubs/de-microservices/offers';

export const stubChangeSubscriptionFutureDatedChangePlan = () => {
    cy.intercept('POST', '**/services/account', {
        fixture: 'de-microservices/account/change-subscription-organic_selfpay-promo-follow-on.json',
    });
    stubOffersCustomerChangeOrganicMultiple();
    stubOffersInfoChangeSubscriptionOrganicMultiple();
};
