import { createAction, props } from '@ngrx/store';
import { OfferModel } from '@de-care/data-services';

export const loadAccountAndChangeStep = createAction(
    '[Checkout] Load Account and Change Step',
    props<{ offer: OfferModel; isStreaming: boolean; formStep?: number; attemptedEmail: string }>()
);
export const loadAccountFromCustomer = createAction(
    '[Checkout] Load Account from Customer',
    props<{ programCode: string; isStreaming: boolean; formStep?: number; attemptedEmail: string }>()
);

export const loadOfferInfoForLeadOfferPlanCodes = createAction(
    '[Checkout]  Load offer info for lead offer plan codes',
    props<{ planCodes: { leadOfferPlanCode: string; followOnPlanCode?: string; renewalPlanCodes?: string[] }[] }>()
);

export const setNucaptchaRequired = createAction('[Checkout] Set nucaptcha is required');

export const setNucaptchaNonRequired = createAction('[Checkout] Set nucaptcha non required');

export const formatAndSetLangPrefFromUrlParam = createAction('[Checkout] Format lang pref and set lang');
