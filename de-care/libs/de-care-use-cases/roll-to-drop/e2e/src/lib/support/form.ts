import {
    cyGetAccountLookupButton,
    cyGetAccountLookupEmailField,
    cyGetCCAddress,
    cyGetCCCity,
    cyGetCCState,
    cyGetCCZipCode,
    cyGetChargeAgreementCheckbox,
    cyGetE2EConfirmationButton,
    cyGetE2ECreditCardFormFieldsCCExpirationDate,
    cyGetE2ECreditCardFormFieldsCCNameOnCard,
    cyGetE2ECreditCardNumberInputUnmasked,
    cyGetE2EFollowOnCheckBox,
    cyGetE2ESubscribePageOrderSubmitButton,
    cyGetE2eVerifyAddressRetainButton,
    cyGetNewAccountFormFieldsFirstNameField,
    cyGetNewAccountFormFieldsLastNameField,
    cyGetNewAccountFormFieldsPhoneNumberField,
    cyGetSxmUIPassword
} from '@de-care/shared/e2e';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';

export const fillOutForm = () => {
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
