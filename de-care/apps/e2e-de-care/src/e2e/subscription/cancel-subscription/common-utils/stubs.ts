export const stubModifySubscriptionOptionsWithCancelOnlineEnabled = () => {
    cy.intercept('POST', '**/services/account-mgmt/modify-subscription-options', {
        fixture: 'de-microservices/account-mgmt/modify-subscription-options/with-cancel-online-enabled.json',
    });
};
