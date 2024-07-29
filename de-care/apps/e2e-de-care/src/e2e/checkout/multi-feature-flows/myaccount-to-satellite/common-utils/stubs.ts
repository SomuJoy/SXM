export const stubAccountSuccess = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/success.json' });
};

export const stubAccountSuccessWithInactive = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/success-with-inactive.json' });
};

export const stubNewHotAndTrendingSuccess = () => {
    cy.intercept('GET', '**/phx/services/v1/rest/sites/sxm/types/SXMContentGroup?filter=name:equals:CG%20Section%204%20-%20Home%20Variant%20Mock%20-%20Promos', {
        fixture: 'cms/new-hot-and-trending-success.json',
    });
};

export const stubFlepzRadioWithResults = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/three-closed-radios-one-with-nickname.json' });
};

export const stubFlepzRadioNoResults = () => {
    cy.intercept('POST', '**/services/identity/customer/flepz', { fixture: 'de-microservices/identity/customer/flepz/no-results.json' }).as('flepzCall');
};

export const stubDeviceInfoWithVehicle = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: 'de-microservices/device/info/new-with-vehicle.json' });
};

export const stubDeviceInfoActiveTrialNoVehicle = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: 'de-microservices/device/info/active-trial-no-vehicle.json' });
};
export const stubDeviceInfoActiveSelfPayNoVehicle = () => {
    cy.intercept('POST', '**/services/device/info', { fixture: 'de-microservices/device/info/active-self-pay-no-vehicle.json' });
};

export const stubAccountNonPii = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_closed-radio-with-ymm.json` }).as('accountCall');
};

export const stubOffersCustomerAddForAddRadio = () => {
    cy.intercept('POST', '**/services/offers/customer/add', { fixture: 'de-microservices/offers/customer/add/add-radio-router_success.json' }).as('customOfferCall');
};

export const stubOffersInfoSelfPayPromoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/customer/info/offers-info.json' }).as('offersInfoCall');
};
