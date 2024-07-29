import {
    e2eCCCardNumberTextfield,
    e2eCCCardNumberTextfieldMasked,
    e2eCCCVV,
    e2eCCExpDateOnCardTextfield,
    e2eCCNameOnCardTextfield,
    e2eCreateLoginEmailTextfield,
    e2ePaymentConfirmationButton,
    e2ePaymentForm,
} from '@de-care/customer-info';
import { e2eReviewOrderCompleteButton } from '@de-care/purchase';
import { e2eChargeAgreementCheckbox } from '@de-care/review-order';
import { e2eOfferDetails, e2ePersonalInfo } from '@de-care/sales-common';
import { e2eSxmDropDownItem } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { e2eSxmUIPassword } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { e2eCCAddress, e2eCCCity, e2eCCState, e2eCCZipCode } from '@de-care/shared/sxm-ui/ui-address-form-fields';

export const cyGetCCAddress = () => cy.get(e2eCCAddress);
export const cyGetCCCity = () => cy.get(e2eCCCity);
export const cyGetCCState = () => cy.get(e2eCCState);
export const cyGetSxmDropDownItem = () => cy.get(e2eSxmDropDownItem);
export const cyGetCCStateItems = () => cyGetCCState().within(() => cyGetSxmDropDownItem());
export const cyGetCCZipCode = () => cy.get(e2eCCZipCode);

export const cyGetCCNameOnCardTextfield = () => cy.get(e2eCCNameOnCardTextfield);
export const cyGetCCCardNumberTextfield = () => cy.get(e2eCCCardNumberTextfield);
export const cyGetCCCardNumberTextfieldMasked = () => cy.get(e2eCCCardNumberTextfieldMasked);
export const cyGetCCExpDateOnCardTextfield = () => cy.get(e2eCCExpDateOnCardTextfield);
export const cyGetCCCVV = () => cy.get(e2eCCCVV);
export const cyGetPaymentConfirmationButton = () => cy.get(e2ePaymentConfirmationButton);
export const cyGetCreateLoginEmailTextfield = () => cy.get(e2eCreateLoginEmailTextfield);

export const cyGetPaymentFormComponent = () => cy.get(e2ePaymentForm);

export const cyGetSxmUIPassword = () => cy.get(e2eSxmUIPassword);

export const cyGetChargeAgreementCheckbox = () => cy.get(e2eChargeAgreementCheckbox);
export const cyGetReviewOrderCompleteButton = () => cy.get(e2eReviewOrderCompleteButton);

export const cyGetPersonalInfo = () => cy.get(e2ePersonalInfo);
export const cyGetOfferDetails = () => cy.get(e2eOfferDetails);
