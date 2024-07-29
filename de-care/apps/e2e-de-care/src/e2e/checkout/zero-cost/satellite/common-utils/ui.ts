export const visitZeroCostSatelliteOrganicWithValidPromoCode = () => {
    cy.visit(`/subscribe/checkout/promotion/satellite/device-lookup?promoCode=VALID`);
};
export const visitZeroCostSatelliteOrganicWithRedeemedPromoCode = () => {
    cy.visit(`/subscribe/checkout/promotion/satellite/device-lookup?promoCode=REDEEMED`);
};
export const visitZeroCostSatelliteOrganicWithInvalidPromoCode = () => {
    cy.visit(`/subscribe/checkout/promotion/satellite/device-lookup?promoCode=INVALID`);
};
export const visitZeroCostSatelliteOrganicWithExpiredPromoCode = () => {
    cy.visit(`/subscribe/checkout/promotion/satellite/device-lookup?promoCode=EXPIRED`);
};

export const fillInDeviceIdWithRadioIdAndSubmit = () => {
    cy.get('step-device-lookup-page input[name="deviceId"]').type('B3R0004H');
    cy.get('step-device-lookup-page button[type="submit"]').click();
};

export const deviceInstructionsShouldContainVehicleInfo = () => {
    cy.get('step-account-info-page #deviceInstructions').should('contain.text', '2022 Kia Telluride');
};
export const deviceInstructionsShouldContainRadioIdInfo = () => {
    cy.get('step-account-info-page #deviceInstructions').should('contain.text', 'radio (ID');
};

const fillInAccountInfo = () => {
    cy.get('[data-e2e="AccountInfoFirstName"]').type('Jane');
    cy.get('[data-e2e="AccountInfoLastName"]').type('Smith');
    cy.get('[data-e2e="AccountInfoEmail"]').type('johnsmith@siriusxm.com');
    cy.get('[data-e2e="AccountInfoPhoneNumber"]').type('8046666666');
    cy.get('[data-e2e="CCAddress"]').type('1234 Block', { force: true });
    cy.get('[data-e2e="CCCity"]').type('Beverly Hills', { force: true });
    cy.get('[data-e2e="CCState"]').contains('CA').click({ force: true });
    cy.get('[data-e2e="CCZipCode"]').type('90210', { force: true });
};
const submitAccountInfo = () => {
    cy.get('[data-e2e="AccountInfoConfirmationButton"]').click();
};
export const fillInAccountInfoAndSubmit = () => {
    fillInAccountInfo();
    submitAccountInfo();
};

export const refreshSignalFormShouldBeVisible = () => {
    cy.get('refresh-signal').should('be.visible');
};
export const submitRefreshSignal = () => {
    cy.get('[data-e2e="sendRefreshSignalButton"]').click();
};
export const deviceValidateErrorShouldBeVisibleAndContain = (text: string) => {
    cy.get('step-device-lookup-page form .invalid-feedback').should('be.visible').should('contain', text);
};
