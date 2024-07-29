export function getOffers() {
    cy.route('POST', `**/offers`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/follow-on-offers-eligible-streaming.json'));
}

export function getRenewals() {
    cy.route('POST', `**/offers/renewal`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/follow-on-eligible-renewal-streaming.json'));
}

export function fillOutEnterYourEmailForm() {
    cy.get('[data-e2e="accountLookup.emailField"]').type('mytest@siriusxm.com', { force: true });
    cy.wait(1000);
    cy.get('[data-e2e="accountLookup.lookupButton"]').click({ force: true });
}

export function fillOutEnterYourInformationForm() {
    cy.get('[data-e2e="newAccountFormFields.firstNameInput"]').type('Mike', { force: true });
    cy.get('[data-e2e="newAccountFormFields.lastNameInput"]').type('Test', { force: true });
    cy.get('[data-e2e="newAccountFormFields.phoneNumber"]').type('8052222222', { force: true });
    cy.get('[data-e2e="CCAddress"]').first().type('1234 Block', { force: true });
    cy.get('[data-e2e="CCCity"]').first().type('Beverly Hills', { force: true });
    cy.get('[data-e2e="CCState"]').first().contains('CA').click({ force: true });
    cy.get('[data-e2e="CCZipCode"]').first().type('90210', { force: true });
    cy.get('[data-e2e="sxmUIPassword"]').type('Friday@5', { force: true }).blur();
    cy.wait(1000);
}

export function selectFollowOn() {
    cy.get('[data-e2e="trialFollowOnFormField.followOnCheckBox"]').check({ force: true });
}

export function fillOutPaymentInfoForm() {
    cy.get('[data-e2e="creditCardFormFields.ccNameOnCard"]').type('test t', { force: true });
    cy.get('[data-e2e="creditCardNumberInput.unmasked"]').type('4111111111111111', { force: true });
    cy.get('[data-e2e="creditCardFormFields.ccExpirationDate"]').type('11/33', { force: true });
    cy.get('[data-e2e="ccCVV"]').type('111', { force: true });
}

export function rtdFixtures() {
    getOffers();
    getRenewals();
    cy.sxmMockEmailIdentityValidationSuccess();
    cy.sxmMockPasswordValidationSuccess();
    cy.sxmMockEmailValidationSuccess();
    cy.sxmMockAddressesAndCCValidationSuccess();
    cy.route('POST', `**/quotes/quote`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/quote-trial-streaming.json'));
    cy.route('POST', `**/purchase/new-account`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/new-account-trial-streaming.json'));
    cy.route('POST', `**/trial-activation/new-account`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/new-account-trial-streaming.json'));
    cy.route('GET', `**/utility/security-questions`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/security-questions-trial-streaming.json'));
    cy.route(
        'POST',
        `**/offers/customer`,
        // tslint:disable-next-line:max-line-length
        require('../../../../fixtures/features/smoke-tests/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-for-program-code-after-identification.json')
    );
    cy.route('POST', `**/check-eligibility/captcha`, require('../../../../fixtures/features/smoke-tests/rtd-streaming/captcha.json'));
    cy.route(
        'POST',
        `**/offers/info`,
        // tslint:disable-next-line:max-line-length
        require('../../../../fixtures/features/smoke-tests/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-info-for-plan-code-after-payment-info.json')
    );
}

export function isEligibleFixture(eligible: boolean) {
    return eligible
        ? cy.route(
              'POST',
              `**/check-eligibility/streaming`,
              // tslint:disable-next-line:max-line-length
              require('../../../../fixtures/features/smoke-tests/checkout-streaming-plan-organic/consumption-logic-eligibility-check/check-eligibility-streaming-is-eligible.json')
          )
        : cy.route(
              'POST',
              `**/check-eligibility/streaming`,
              // tslint:disable-next-line:max-line-length
              require('../../../../fixtures/features/smoke-tests/checkout-streaming-plan-organic/consumption-logic-eligibility-check/check-eligibility-streaming-is-not-eligible.json')
          );
}
