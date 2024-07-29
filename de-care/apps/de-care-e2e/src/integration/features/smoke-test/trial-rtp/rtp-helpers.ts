import { servicesUrlPrefix } from '@de-care/shared/e2e';

export const fillOutYourInfoAndPayment = () => {
    cy.get('[data-e2e="sxmUIEmail"]').type('dillo@siriusxm.com', { force: true });
    cy.get('[data-e2e="sxmUIPhoneNumber"]').type('2122222222');
    getElementFromIndex(0, '[data-e2e="sxmUITextFormField"]').type('1234 street road');
    getElementFromIndex(1, '[data-e2e="sxmUITextFormField"]').type('city land');
    cy.get('sxm-ui-dropdown').type('co{enter}', { force: true });
    getElementFromIndex(2, '[data-e2e="sxmUITextFormField"]').type('ron burgandy');
    cy.get('[data-e2e="creditCardNumberInput.unmasked"]').type('4111 1111 1111 1111', { force: true });
    cy.get('[data-e2e="ccExp"]').type('4/24', { force: true });
    submit('[data-e2e="createAccountSubmitButton"]');
};

export const reviewAndSubmit = () => {
    cy.get('[data-e2e="chargeAgreementCheckbox"]').click({ force: true });
    submit('[date-e2e="CompleteMyOrderButton"]');
};

export const submit = (tag?: string) => {
    tag ? cy.get(tag).click({ force: true }) : cy.get('button').click({ force: true });
};

export const getElementFromIndex = (index: number, element: string) => {
    return cy.get(element).eq(index);
};

export const mockRTPAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockEmailIdentityValidationSuccess();
    cy.sxmMockEmailValidationSuccess();
    cy.sxmMockAddressesAndCCValidationSuccess();
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../../fixtures/features/smoke-tests/trial-rtp/non-pii.json'));
    cy.route('POST', `${servicesUrlPrefix}/device/info`, require('../../../../fixtures/features/smoke-tests/trial-rtp/info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/customer`, require('../../../../fixtures/features/smoke-tests/trial-rtp/customer.json'));
    cy.route('GET', `${servicesUrlPrefix}/account/customer-info`, require('../../../../fixtures/features/smoke-tests/trial-rtp/customer-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/customer-info`, require('../../../../fixtures/features/smoke-tests/trial-rtp/customer-info-follow-up.json'));
    cy.route('POST', `${servicesUrlPrefix}/device/info`, require('../../../../fixtures/features/smoke-tests/trial-rtp/info.json'));
    cy.route('POST', `${servicesUrlPrefix}/check-eligibility/captcha`, require('../../../../fixtures/features/smoke-tests/trial-rtp/captcha.json'));
    cy.route('POST', `${servicesUrlPrefix}/quotes/quote`, require('../../../../fixtures/features/smoke-tests/trial-rtp/quote.json'));
    cy.route('POST', `${servicesUrlPrefix}/purchase/new-account`, require('../../../../fixtures/features/smoke-tests/trial-rtp/new-account.json'));
    cy.route('POST', `${servicesUrlPrefix}/purchase/new-account`, require('../../../../fixtures/features/smoke-tests/trial-rtp/new-account-submit.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../../fixtures/features/smoke-tests/trial-rtp/non-pii-submit.json'));
    cy.route('GET', `${servicesUrlPrefix}/utility/security-questions`, require('../../../../fixtures/features/smoke-tests/trial-rtp/security-questions.json'));
};
