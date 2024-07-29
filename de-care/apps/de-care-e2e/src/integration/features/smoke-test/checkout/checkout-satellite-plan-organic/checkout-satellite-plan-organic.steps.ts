import {
    cyGetChargeAgreementCheckbox,
    cyGetContentCardOrderDetailsAmount,
    cyGetContentCardOrderDetailsFeesAndTaxesAmount,
    cyGetContentCardOrderDetailsTermAndPrice,
    cyGetContentCardOrderDetailsTotalDue,
    cyGetContentCardOrderDetailsTotalDueText,
    cyGetFlepzEmailTextfield,
    cyGetFlepzFirstNameTextfield,
    cyGetFlepzFormContinueButton,
    cyGetFlepzLastNameTextfield,
    cyGetFlepzPhoneNumberTextfield,
    cyGetFlepzVerifyDeviceTabs,
    cyGetFlepzZipCodeTextfield,
    cyGetOfferUpsellContinueButton,
    cyGetOrderSummary,
    cyGetOrderSummaryAccordionContentCard,
    cyGetPaymentConfirmationButton,
    cyGetPaymentInfoUseExistingCard,
    cyGetPersonalInfo,
    cyGetPurchaseAccordionItemContent,
    cyGetPurchaseAccordionItemTitle,
    cyGetReviewOrderCompleteButton,
    cyGetSummaryCardNonStudentRecurringCharge,
    cyGetSxmUiModalContent,
    cyGetVerifyDeviceTabsFlepzForm,
    cyGetYourInfo,
    cyGetYourInfoContinueButton,
    getAliasForURL,
    mockRoutesFromHAR,
    servicesUrlPrefix,
    sxmCheckPageLocation
} from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const fillOutFlepzForm = () => {
    cyGetFlepzFirstNameTextfield().type('Paula');

    cyGetFlepzLastNameTextfield().type('Myo');

    cyGetFlepzEmailTextfield().type(`test${+Date.now()}@siriusxm.com`);

    cyGetFlepzPhoneNumberTextfield().type('2222222222');

    cyGetFlepzZipCodeTextfield()
        .first()
        .type('10002');
};

function checkOrderDetails() {
    cyGetOrderSummary().should('be.visible');

    cy.sxmEnsureNoMissingTranslations();

    cyGetOrderSummaryAccordionContentCard()
        .should('have.length', 2)
        .first()
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$29.94');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', '6 Months for $4.99/mo');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$6.41');
            cyGetContentCardOrderDetailsTotalDueText().should('contain', 'Total - Due Now');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$36.35');
        });
    cyGetSummaryCardNonStudentRecurringCharge().should('contain', '$20.63 starting on 03/15/2021');
    cyGetOrderSummaryAccordionContentCard()
        .eq(1)
        .should('be.visible')
        .within(() => {
            cyGetContentCardOrderDetailsAmount().should('contain', '$16.99');
            cyGetContentCardOrderDetailsTermAndPrice().should('contain', 'Monthly Plan');
            cyGetContentCardOrderDetailsFeesAndTaxesAmount().should('contain', '$3.64');
            cyGetContentCardOrderDetailsTotalDueText().should('contain', 'Total Due - 03/15/2021');
            cyGetContentCardOrderDetailsTotalDue().should('contain', '$20.63');
        });
}

function checkConfirmationPage() {
    sxmCheckPageLocation('/subscribe/checkout/thanks');

    cy.get('app-thanks').should('be.visible');

    cy.sxmEnsureNoMissingTranslations();

    cyGetPersonalInfo().should('contain', 'Radio ID: (****00AP)');

    checkOrderDetails();
}

function checkAccordionSteps({ hasUpsells = false }) {
    const accordionTitles = ['1. Verify your device', '2. Your billing information'].concat(
        hasUpsells ? ['3. Choose package upgrades', '4. Review and complete your order'] : ['3. Review and complete your order']
    );

    accordionTitles?.forEach((title, i) =>
        cyGetPurchaseAccordionItemTitle()
            .eq(i)
            .should('contain', title)
    );
}

function checkAccordionCurrentStep(step: number, hasUpsells = false) {
    const indices = hasUpsells ? [0, 1, 2, 3] : [0, 1, 2];

    indices.splice(step, 1);

    indices?.forEach(i =>
        cyGetPurchaseAccordionItemContent()
            .eq(i)
            .should('not.be.visible')
    );

    cyGetPurchaseAccordionItemContent()
        .eq(step)
        .should('be.visible');
}

Before(() => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockEnvInfo();
    mockRoutesFromHAR(require('../../../../../fixtures/features/smoke-tests/checkout/flepz-smoke.har.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/info`, require('../../../../../fixtures/features/smoke-tests/checkout/info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/upsell/info`, require('../../../../../fixtures/features/smoke-tests/checkout/flepz-offers-upsell-info.response.json'));
    cy.route('POST', `${servicesUrlPrefix}/check-eligibility/captcha`, require('../../../../../fixtures/features/smoke-tests/checkout/captcha.json'));
});

Given('a customer enters the organic satellite flow', () => {
    cy.visit('/subscribe/checkout/flepz');

    checkAccordionSteps({ hasUpsells: false });
    checkAccordionCurrentStep(0);

    cyGetPurchaseAccordionItemContent()
        .first()
        .should('not.be.hidden');

    cyGetFlepzVerifyDeviceTabs().should('be.visible');

    cy.sxmEnsureNoMissingTranslations();

    cyGetVerifyDeviceTabsFlepzForm().should('be.visible');
    cyGetVerifyDeviceTabsFlepzForm().scrollIntoView();
});

When('the user enters their information and complets the flow', () => {
    fillOutFlepzForm();

    cyGetFlepzFormContinueButton().click({ force: true });

    cyGetSxmUiModalContent()
        .should('be.visible')
        .within(() => {
            cyGetYourInfo().should('be.visible');
            cyGetYourInfoContinueButton().click({ force: true });
        });

    const upsellsRouteAlias = getAliasForURL('POST', '/services/offers/upsell');
    cy.wait(`@${upsellsRouteAlias}`);

    checkAccordionCurrentStep(1);
    cy.sxmEnsureNoMissingTranslations();

    cyGetPaymentInfoUseExistingCard().click({ force: true });
    cyGetPaymentConfirmationButton().click({ force: true });

    checkAccordionCurrentStep(2);

    cy.get('sxm-ui-package-satellite-upgrade-card-form-field')
        .should('be.visible')
        .within(() => {
            cy.sxmEnsureNoMissingTranslations();
            cy.get('sxm-ui-content-card').should('be.visible');
        });

    cyGetOfferUpsellContinueButton().click({ force: true });

    checkAccordionCurrentStep(3);

    checkOrderDetails();

    cyGetChargeAgreementCheckbox().check({ force: true });

    cyGetReviewOrderCompleteButton().click({ force: true });
});

Then('the user sucessfully purchases a satellite plan', () => {
    checkConfirmationPage();
});
