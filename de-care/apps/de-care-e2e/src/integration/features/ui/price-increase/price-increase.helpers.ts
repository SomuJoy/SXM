import { servicesUrlPrefix } from '@de-care/shared/e2e';

export const verifyByRadioID = () => {
    cy.sxmWaitForSpinner();
    cy.get('[data-e2e="FlepzCarInfoLink"]')
        .click({ force: true })
        .then(() => {
            cy.get('button').then(() => {
                cy.get('[data-e2e="radioLookupOptions.carInfoContinueButton"]').click({ force: true, multiple: true });
            });
        });
    cy.get('[data-e2e="lookupRadioId.input"]').type('990005779211', { force: true });
    submit('[data-e2e="lookupRadioId.button"]');
};

export const validateRadioLookup = () => {
    cy.get('[data-e2e="validateLastNameInput"]').type('beats');
    cy.get('[data-e2e="validatePhoneInput"]').type('2122222222');
    cy.get('[data-e2e="validateZipInput"]').type('m1k6a7');
    submit('[data-e2e="validateSubmissionButton"]');
};

export const fillOutYourInfoAndPaymentForm = () => {
    cy.get('[data-e2e="purchase.paymentInfoComponent"]').within(() => {
        cy.get('sxm-ui-flepz-form-fields').within(() => {
            cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('jello', { force: true });
            cy.get('[data-e2e="FlepzLastNameTextfield"]').type('beats', { force: true });
            cy.get('[data-e2e="FlepzEmailTextfield"]').type('jellobeats@siriusxm.com', { force: true });
            cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('2122222222', { force: true });
        });
        cy.get('sxm-ui-address-form-fields').within(() => {
            cy.get('[data-e2e="CCAddress"]')
                .eq(0)
                .type('1234 street road');
            cy.get('[data-e2e="CCCity"]')
                .eq(0)
                .type('town');
            cy.get('sxm-ui-dropdown')
                .eq(0)
                .type('a{enter}', { force: true });
            cy.get('[data-e2e="CCZipCode"]')
                .eq(0)
                .type(`m1k6a7`, { force: true });
        });
        cy.get('[data-e2e="CCNameOnCardTextfield"]').type('jello beats', { force: true });
        cy.get('[data-e2e="CCCardNumberTextfield"]').type('4111 1111 1111 1111', { force: true });
        cy.get('[data-e2e="ccExpDateOnCardTextfield"]').type('0425', { force: true });
        cy.get('[data-e2e="ccCVV"]').type('111');
    });
    submit('[data-e2e="PaymentConfirmationButton"]');
};

export const continueUpsell = () => {
    cy.get('sxm-ui-modal').within(() => {
        submit('[data-e2e="differentPlatformAcceptButton"]');
    });
};

export const submit = (tag?: string) => {
    tag ? cy.get(tag).click({ force: true }) : cy.get('button').click({ force: true });
};

export const useSavedVisa = () => {
    cy.get('[data-e2e="paymentInfo.useExistingCard"]').click({ force: true });
    submit('[data-e2e="PaymentConfirmationButton"]');
};

export const continueSelectUpsell = () => {
    cy.get('[data-e2e="offerUpsell.continueButton"]').click({ force: true });
};

export const mockExistingTrialConversionAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockIP2LocationSuccess();
    cy.route('POST', `${servicesUrlPrefix}/offers`, require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/offers.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/device/validate`,
        require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/validate.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/account/non-pii`,
        require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/validate.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/device/info`, require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/info.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/verify`, require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/non-pii.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/customer.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/validate/customer-info`,
        require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/customer-info.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell`, require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/upsell.json'));
    cy.route('POST', `${servicesUrlPrefix}/quotes/quote`, require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/quote.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/captcha`,
        require('../../../../fixtures/features/ui-tests/price-increase/existing-customer-trial-conversion/captcha.json')
    );
};

export const mockClosedRadioSubscriptionAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockIP2LocationSuccess();
    cy.route('POST', `${servicesUrlPrefix}/offers`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/offers.json'));
    cy.route('POST', `${servicesUrlPrefix}/device/validate`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/validate.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/non-pii.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/verify`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/verify.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/customer`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/customer.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/upsell.json'));
    cy.route('POST', `${servicesUrlPrefix}/quotes/quote`, require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/quote.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/captcha`,
        require('../../../../fixtures/features/ui-tests/price-increase/closed-radio-new-subscription/captcha.json')
    );
};

export const mockNewSatelliteSubscriptionAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockIP2LocationSuccess();
    cy.route('POST', `${servicesUrlPrefix}/offers`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/offers.json'));
    cy.route('POST', `${servicesUrlPrefix}/validate`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/validate.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/non-pii.json'));
    cy.route('POST', `${servicesUrlPrefix}/device/info`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/customer`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/customer.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/upsell.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/validate/customer-info`,
        require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/customer-info.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/quotes/quote`, require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/quote.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/captcha`,
        require('../../../../fixtures/features/ui-tests/price-increase/new-satellite-subscription/captcha.json')
    );
};

export const mockCustomerTriesActivateStreamingAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockPasswordValidationSuccess();
    cy.sxmMockEmailValidationSuccess();
    cy.sxmMockAddressesAndCCValidationSuccess();
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/offers.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/validate/customer-info`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/customer-info.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/customer.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/upsell`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/upsell.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/customer-follow-up.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/upsell`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/upsell-follow-up.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/streaming`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/streaming.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/quotes/quote`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/quote.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/captcha`,
        require('../../../../fixtures/features/ui-tests/price-increase/customer-tries-activate-streaming-subscription/captcha.json')
    );
};
