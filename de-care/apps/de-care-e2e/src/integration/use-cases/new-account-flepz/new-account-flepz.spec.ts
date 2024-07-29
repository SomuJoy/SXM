import {
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    mockRouteForEnvInfo,
    mockRoutesFromHAR,
    cyGetE2EVerifyDeviceTabsCarInfoButtonTab,
    sxmWaitForSpinner,
    cyGetE2ERadioLookupOptionsCarInfoContinueButton,
    cyGetE2ELookupRadioIDButton,
    cyGetE2ELookupRadioIDInput,
    cyGetFlepzFirstNameTextfield,
    cyGetFlepzLastNameTextfield,
    cyGetFlepzEmailTextfield,
    cyGetFlepzPhoneNumberTextfield,
    cyGetCCAddress,
    cyGetCCCity,
    cyGetCCState,
    cyGetPurchaseAccordionItemTitle,
    cyGetPurchaseAccordionItemContent,
    cyGetCCZipCode,
    cyGetCCNameOnCardTextfield,
    cyGetCCExpDateOnCardTextfield,
    cyGetCCCardNumberTextfield,
    cyGetE2eVerifyAddressRetainButton,
    cyGetE2EPriceIncreaseMessageMessageCopy,
    cyGetE2EBillingAddressModal,
    cyGetPaymentConfirmationButton,
    cyGetCCCVV
} from '@de-care/shared/e2e';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

// should eventually be shared
function checkAccordionSteps({ hasUpsells = false }) {
    const accordionTitles = ['1. Verify your device', '2. Your billing information'].concat(
        hasUpsells ? ['3. Choose plan upgrades', '4. Review and complete your order'] : ['3. Review and complete your order']
    );

    accordionTitles.forEach((title, i) =>
        cyGetPurchaseAccordionItemTitle()
            .eq(i)
            .should('contain', title)
    );
}

// should eventually be shared
function checkAccordionCurrentStep(step: number, hasUpsells = false) {
    const indices = hasUpsells ? [0, 1, 2, 3] : [0, 1, 2];

    indices.splice(step, 1);

    indices.forEach(i =>
        cyGetPurchaseAccordionItemContent()
            .eq(i)
            .should('not.be.visible')
    );

    return cyGetPurchaseAccordionItemContent()
        .eq(step)
        .should('be.visible');
}

// should eventually be shared
const fillOutForm = (routeMocks: any) => {
    cyGetE2EVerifyDeviceTabsCarInfoButtonTab()
        .first()
        .click({ force: true });

    cyGetE2ERadioLookupOptionsCarInfoContinueButton()
        .first()
        .click({ force: true });

    cyGetE2ELookupRadioIDInput()
        .first()
        .type('990003308075', { force: true });

    cyGetE2ELookupRadioIDButton()
        .first()
        .click({ force: true });

    sxmWaitForSpinner();

    checkAccordionCurrentStep(1).within(_ => {
        cyGetFlepzFirstNameTextfield()
            .first()
            .type('john', { force: true });

        cyGetFlepzLastNameTextfield()
            .first()
            .type('smith', { force: true });

        cyGetFlepzEmailTextfield()
            .first()
            .type('johnjaysmith@siriusxm.com', { force: true });

        cyGetFlepzPhoneNumberTextfield()
            .first()
            .type('9823648547', { force: true });

        cyGetCCAddress()
            .first()
            .type('1234 street road', { force: true });

        cyGetCCCity()
            .first()
            .type('colorado springs', { force: true });

        cyGetCCState()
            .first()
            .click({ force: true })
            .find(e2eSxmDropDownItem)
            .first()
            .click({ force: true });

        cyGetCCZipCode()
            .first()
            .type('80918', { force: true });

        cyGetCCNameOnCardTextfield()
            .first()
            .type('john smith', { force: true });

        cyGetCCCardNumberTextfield()
            .first()
            .type('4111 1111 1111 1111', { force: true });

        cyGetCCExpDateOnCardTextfield()
            .first()
            .type('0224', { force: true });

        cyGetCCCVV()
            .first()
            .type('123', { force: true });

        cyGetPaymentConfirmationButton()
            .first()
            .click({ force: true });
    });

    cyGetE2EBillingAddressModal().within(() => {
        cyGetE2eVerifyAddressRetainButton()
            .first()
            .click({ force: true });
    });
};

describe('Purchase - new account flepz', () => {
    let routeMocks: any;

    beforeEach(() => {
        cy.server();
        mockRouteForCardBinRanges();
        mockRouteForEnvInfo();
        mockRouteForAllPackageDescriptions();
        routeMocks = mockRoutesFromHAR(require('../../../fixtures/new-account-flepz.har.json'));
    });
    describe('Should display price increase message (seasonal)', () => {
        it('should present correct price increase copy message', () => {
            cy.visit(`/subscribe/checkout/flepz?programcode=FPMOSTMUSIC`);
            sxmWaitForSpinner();

            fillOutForm(routeMocks);

            cy.sxmEnsureNoMissingTranslations();
            cyGetE2EPriceIncreaseMessageMessageCopy().should('be.visible');
        });
    });
});
