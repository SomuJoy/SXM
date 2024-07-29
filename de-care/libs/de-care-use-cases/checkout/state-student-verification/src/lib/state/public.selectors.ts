import { createSelector } from '@ngrx/store';
import { getSelectedOfferViewModel } from '@de-care/de-care-use-cases/checkout/state-common';
import { getProgramCodeFromQueryParams, getLangPrefFromQueryParams, getSheerIdVerificationWidgetUrl } from './selectors';

export const getProgramCode = createSelector(getProgramCodeFromQueryParams, (programCode) => ({
    programCode,
}));

export const getStudentVerificationViewModel = createSelector(
    getSheerIdVerificationWidgetUrl,
    getProgramCodeFromQueryParams,
    getLangPrefFromQueryParams,
    getSelectedOfferViewModel,
    (sheerIdVerificationWidgetUrl, programCode, langPref, selectedOffer) => ({
        sheerIdVerificationWidgetUrl,
        programCode,
        langPref,
        selectedOffer,
    })
);
