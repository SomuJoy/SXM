import {
    cyGetAccountLookupButton,
    cyGetAccountLookupEmailField,
    mockRoutesFromHAR,
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    mockRouteForEnvInfo,
    cyGetNewAccountFormFieldsFirstNameField,
    cyGetNewAccountFormFieldsLastNameField,
    cyGetNewAccountFormFieldsPhoneNumberField,
    cyGetCCAddress,
    cyGetCCCity,
    cyGetCCState,
    cyGetCCZipCode,
    cyGetSxmUIPassword,
    cyGetChargeAgreementCheckbox,
    cyGetE2EFollowOnCheckBox,
    cyGetE2ECreditCardNumberInputUnmasked,
    cyGetE2ECreditCardFormFieldsCCNameOnCard,
    cyGetE2ECreditCardFormFieldsCCExpirationDate,
    cyGetE2ESubscribePageOrderSubmitButton,
    cyGetE2EConfirmationButton,
    cyGetE2eVerifyAddressRetainButton,
    cyGetE2ECreditCardFormFieldsCCUnexpectedErrorCopy
} from '@de-care/shared/e2e';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

const fillOutForm = () => {
    cyGetAccountLookupEmailField()
        .first()
        .type('batman@siriusxm.com');

    cyGetAccountLookupButton()
        .first()
        .click();

    cyGetNewAccountFormFieldsFirstNameField()
        .first()
        .type('Bruce');

    cyGetNewAccountFormFieldsLastNameField()
        .first()
        .type('Wayne', { force: true });

    cyGetNewAccountFormFieldsPhoneNumberField()
        .first()
        .type('5674662398', { force: true });

    cyGetCCAddress()
        .first()
        .type('1234 street road', { force: true });

    cyGetCCCity()
        .first()
        .type('gotham', { force: true });

    cyGetCCState()
        .first()
        .click({ force: true })
        .find(e2eSxmDropDownItem)
        .first()
        .click({ force: true });

    cyGetCCZipCode()
        .first()
        .type('80918', { force: true });

    cyGetSxmUIPassword()
        .first()
        .type('happY#22CH3c!', { force: true });

    cyGetE2EFollowOnCheckBox()
        .first()
        .click({ force: true });

    cyGetE2ECreditCardFormFieldsCCNameOnCard()
        .first()
        .type('Bruce Wayne', { force: true });

    cyGetE2ECreditCardNumberInputUnmasked()
        .first()
        .type('4111 1111 1111 1111', { force: true });

    cyGetE2ECreditCardFormFieldsCCExpirationDate()
        .first()
        .type('04/24', { force: true });

    cyGetE2EConfirmationButton()
        .first()
        .click({ force: true });

    cyGetE2EConfirmationButton()
        .first()
        .click({ force: true });

    cyGetE2eVerifyAddressRetainButton()
        .first()
        .click({ force: true });

    cyGetChargeAgreementCheckbox()
        .first()
        .click({ force: true });

    cyGetE2ESubscribePageOrderSubmitButton()
        .first()
        .click({ force: true });
};

export const testRollToDropNewAccountCCFraud = () => {
    describe('Use Case - roll-to-drop', () => {
        beforeEach(() => {
            cy.server();
            mockRouteForCardBinRanges();
            mockRouteForEnvInfo();
            mockRouteForAllPackageDescriptions();
            mockRoutesFromHAR(require('../fixtures/new-account-trial-streaming-cc-fraud.har.json'));
        });
        describe('Scenario - purchase with Fraud Credit Card Error', () => {
            it('should show error message if user submits payment with a Fraud Credit Card', () => {
                cy.visit('/subscribe/trial/streaming?programcode=USTPSRTD3MOFREE');

                fillOutForm();

                cyGetE2ECreditCardFormFieldsCCUnexpectedErrorCopy().should('be.visible');
            });
        });
    });
};
