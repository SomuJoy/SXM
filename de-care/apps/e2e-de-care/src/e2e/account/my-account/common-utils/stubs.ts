export const stubAccountSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/success.json' });
};
export const stubAccountWithNicknameSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-nickname-success.json' });
};
export const stubAccountWithInfotainmentSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-infotainment-success.json' });
};
export const stubAccountWithMultipleSubscriptionsSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-multiple-subscriptions-success.json' });
};
export const stubAccountWithPriceChangeEligiblePlanSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-price-change-MSRP-success.json' });
};
export const stubAccountWithPlatinumBundleNextPlanSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-platinum-bundle-next-plan.json' });
};
export const stubAccountWithAudioPriceChangeEligiblePlanSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-price-change-MRD-success.json' });
};
export const stubNewHotAndTrendingSuccess = () => {
    cy.intercept('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMContentGroup?filter=name:equals:CG%20Section%204%20-%20Home%20Variant%20Mock%20-%20Promos', {
        fixture: 'cms/new-hot-and-trending-success.json',
    });
};
export const stubModifySubscriptionOptionsSuccess = () => {
    cy.intercept('POST', '**/services/account-mgmt/modify-subscription-options', { fixture: 'de-microservices/account-mgmt/modify-subscription-options/success.json' });
};
export const stubNextBestActionSuccess = () => {
    cy.intercept('GET', '**/services/account/next-best-action', { fixture: 'de-microservices/account/next-best-action/success-no-actions.json' });
};
export const stubValidateEmailSuccess = () => {
    cy.intercept('POST', '**/services/validate/email', { fixture: 'de-microservices/validate/customer-info/email-success.json' });
};
export const stubSubscriptionBillingActivitySuccess = () => {
    cy.intercept('POST', '**/services/billing/activity', { fixture: 'de-microservices/billing/history/subscription-activity-success.json' });
};
export const stubPaymentBillingActivitySuccess = () => {
    cy.intercept('POST', '**/services/billing/activity', { fixture: 'de-microservices/billing/history/payment-activity-success.json' });
};
export const stubSubscriptionBillingActivityNoDataSuccess = () => {
    cy.intercept('POST', '**/services/billing/activity', { fixture: 'de-microservices/billing/history/subscription-activity-no-data-success.json' });
};
