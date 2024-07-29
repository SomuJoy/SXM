import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubAccountVerifySuccess } from '../../../../../support/stubs/de-microservices/account';
import { stubOffersCustomerSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingAccordionOrganicSuccess, stubQuotesQuoteStreamingCommonUpsellTerm } from '../../../../../support/stubs/de-microservices/quotes';

export const goToCredentialsStep = () => {
    visitCheckoutOrganicWithAllowedProgramCode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
};

export const goThroughTransactionUpToReviewStep = () => {
    goToCredentialsStep();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
};

export const visitCheckoutOrganicWithAllowedProgramCodeAndUpcode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&upcode=USDOTPRERTP12MO99G4`);
};

export const visitCheckoutOrganicWithAllowedProgramCodeAndSatupcode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE&satupcode=3FOR1AA`);
};

export const visitCheckoutOrganicWithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE`);
};

export const visitCheckoutOrganicMinVariantWithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic/min?programcode=USTPSRTP3MOFREE`);
};

export const visitCheckoutOrganicMin2VariantWithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic/min2?programcode=USTPSRTP3MOFREE`);
};

export const visitCheckoutOrganicVariant1WithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic/variant1?programcode=USTPSRTP3MOFREE`);
};

export const visitCheckoutOrganicVariant2WithAllowedProgramCode = () => {
    cy.visit(`/subscribe/checkout/purchase/streaming/organic/variant2?programcode=USTPSRTP3MOFREE`);
};

export const clickContinueOnOfferPresentment = () => {
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').eq(0).click();
};

export const clickContinueOnCredentialsInterstitial = () => {
    cy.get('[data-test="submit-credentials-interstitial"]').click();
};

export const clickContinueOnPaymentInterstitial = () => {
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click();
};

export const fillOutAndSubmitAccountLookupForm = () => {
    cy.get('[data-test="sxmUIEmail"]').clear().type('variantperson@siriusxm.com');
    cy.get('[data-test="sxmUIPasswordFormField"]').clear().type('asdASD23@');
    cy.get('button[data-test="submit-credentials"]').click();
};

export const fillOutAndSubmitAccountInfoForm = () => {
    cy.get('[data-test="BillingInfoFirstName"] input').clear().type('Variant');
    cy.get('[data-test="BillingInfoLastName"] input').clear().type('Person');
    cy.get('[data-test="BillingInfoPhoneNumber"] input').clear().type('8051111111');
    cy.get('input[data-test="sxmUIPostalCodeFormField"]').clear().type('12345');
    cy.get('[data-test="continueButton"]').click();
};

export const fillOutPaymentInfoForm = () => {
    cy.get('[data-test="BillingInfoFirstName"] input').clear().type('Variant');
    cy.get('[data-test="BillingInfoLastName"] input').clear().type('Person');
    cy.get('[data-test="BillingInfoPhoneNumber"] input').clear().type('8051111111');
    cy.get('input[name="cc-number"]').clear().type('4111222233334444');
    cy.get('input[name="cc-exp"]').clear({ force: true }).type('0230');
    cy.get('input[name="cc-csc"]').clear().type('123');
    cy.get('input[data-test="sxmUIPostalCodeFormField"]').clear().type('12345');
};

export const fillOutPaymentBasicInfoWithPhoneAndZipFormAndSubmit = () => {
    cy.get('input[data-test="sxmUINameOnCard"]').clear().type('test test');
    cy.get('input[name="cc-number"]').clear().type('4111222233334444');
    cy.get('input[name="cc-exp"]').clear({ force: true }).type('0230');
    cy.get('input[name="cc-csc"]').clear().type('123');
    cy.get('input[data-test="sxmUIPhoneNumber"]').clear().type('8051111111');
    cy.get('input[data-test="sxmUIPostalCodeFormField"]').clear().type('12345');
    cy.get('[data-test="paymentInfoBasicFormSubmitButton"]').click();
};

const submitPaymentForm = () => {
    cy.get('step-organic-payment-page button[sxm-proceed-button]').click();
};
export const fillOutAndSubmitPaymentInfoForm = () => {
    fillOutPaymentInfoForm();
    submitPaymentForm();
};
export const acceptChargeAgreement = () => {
    cy.get('input[name="chargeAgreementAccepted"]').click({ force: true });
};
const fillOutCaptcha = () => {
    cy.get('sxm-ui-nucaptcha form input[qatag="NuCaptchaTextfield"]').clear({ force: true }).type('ARZ', { force: true });
};
const submitReviewForm = () => {
    cy.get('step-organic-review-page button[sxm-proceed-button]').click();
};
export const acceptAndSubmitTransaction = () => {
    acceptChargeAgreement();
    submitReviewForm();
};
export const acceptAndFillOutCaptchaAndSubmitTransaction = () => {
    acceptChargeAgreement();
    fillOutCaptcha();
    submitReviewForm();
};

export const selectTermUpsellAndSubmitPaymentForm = () => {
    cy.get('[data-test="upsellOptionTermOffer"]').click();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingCommonUpsellTerm();
    fillOutAndSubmitPaymentInfoForm();
};

export const fillOutAndSubmitIdentificationValidateLpzForm = () => {
    cy.get('[data-test="sxmUILastNameFormField"]').clear().type('Balcazar');
    cy.get('[data-test="sxmUIPhoneNumber"]').clear().type('2222222222');
    cy.get('[data-test="sxmUIPostalCodeFormField"]').clear().type('12345');
    stubAccountVerifySuccess();
    cy.get('identification-validate-lpz-form button[data-test="submit-lpz-info"]').click();
};
