import { getAliasForURL, sxmCheckPageLocation } from '@de-care/shared/e2e';

export const cyGetUseMySavedVisaRadio = () => cy.get('[data-e2e="paymentForm"] input').first();
export const cyGetNewCreditCardRadio = () => cy.get('[data-e2e="paymentForm"] input').eq(1);
export const cyGetPaymentConfirmationButton = () => cy.get('[data-e2e="PaymentConfirmationButton"]');

export const cyGetChargeAgreementCheckbox = () => cy.get('[data-e2e="chargeAgreementCheckbox"]');

export const cyGetTransferSubscriptionButton = () => cy.get('[data-e2e="transferSubscriptionButton"]');

export const cyGetPortChargeAgreementCheckbox = () => cy.get('[data-e2e="chargeAgreementFormField"]');

export const cyGetAcMethodRadio = () => cy.get('[data-e2e="transferMethodForm"] input').first();
export const cyGetScMethodButton = () => cy.get('[data-e2e="transferMethodForm"] input').eq(1);
export const cyGetAddVehicleButton = () => cy.get('[data-e2e="addVehicleButton"]');

export const cyGetFirstPlanRadio = () => cy.get('[data-e2e="packageSelectionOption"] input').first();
export const cyGetSecondPlanRadio = () => cy.get('[data-e2e="packageSelectionOption"] input').eq(1);
export const cyGetPackageSelectContinueButton = () => cy.get('[data-e2e="packageSelectContinueButton"]');

export const cyGetSCTransferOptionCheckbox = () => cy.get('[data-e2e="scTransferRadioOption"] input');

export const cyGetReviewCompleteOrderButton = () => cy.get('[data-e2e="reviewCompleteOrderButton"]');

export function useMySavedVisaSelect() {
    cyGetUseMySavedVisaRadio().check({ force: true });
}

export function newCreditCardSelect() {
    cyGetNewCreditCardRadio().check({ force: true });
}

export function paymentConfirmationButtonClick() {
    cyGetPaymentConfirmationButton().click({ force: true });
}

export function chargeAgreementCheckboxCheck() {
    cyGetChargeAgreementCheckbox().check({ force: true });
}
export function transferSubscriptionButtonClick() {
    cyGetTransferSubscriptionButton().click({ force: true });
}
export function portChargeAgreementCheckboxCheck() {
    cyGetPortChargeAgreementCheckbox().check({ force: true });
}

export const cyGetStreamingPlayerLinkButton = () => cy.get('.button-link[data-e2e="StreamingPlayerLink"]');

export const cyGetPortGoToMyAccountButton = () => cy.get('[data-e2e="acscConfirmation.goToMyAccountCallToAction"]');

export function acMethodClick() {
    cyGetAcMethodRadio().check({ force: true });
}

export function scMethodClick() {
    cyGetScMethodButton().check({ force: true });
}

export function scMethodRemoveFromAccountClick() {
    cyGetSCTransferOptionCheckbox().check({ force: true });
}

export function addVehicleButtonClick() {
    cyGetAddVehicleButton().click({ force: true });
}

export function firstPlanSelect() {
    cyGetFirstPlanRadio().check({ force: true });
}

export function secondPlanSelect() {
    cyGetSecondPlanRadio().check({ force: true });
}

export function packageSelectContinueButtonClick() {
    cyGetPackageSelectContinueButton().click({ force: true });
}

export function reviewCompleteOrderButtonClick() {
    cyGetReviewCompleteOrderButton().click({ force: true });
}

export function streamingPlayerLinkClick() {
    cyGetStreamingPlayerLinkButton().click();
}

export function portGoToMyAccountButtonClick() {
    cyGetPortGoToMyAccountButton().click({ force: true });
}

export const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown').eq(index).click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]').eq(index).click({ force: true });
        });
    cy.get(`input#regActSecAnswer${index}`).type(text, { force: true });
};

const serviceContinuityRouteAlias = getAliasForURL('POST', '/services/purchase/service-continuity');

export const serivePortabilityComplete = (removeCarFromAccount) => {
    transferSubscriptionButtonClick();

    sxmCheckPageLocation('/transfer/radio/port');

    portChargeAgreementCheckboxCheck();
    reviewCompleteOrderButtonClick();

    cy.wait(`@${serviceContinuityRouteAlias}`).should((xhr) => {
        expect(xhr['status']).to.equal(200);
        expect(xhr.request.body.removeCarFromAccount).to.equal(removeCarFromAccount);
    });
};
