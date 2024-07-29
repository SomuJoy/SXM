import { createSelector } from '@ngrx/store';
import { selectAccount, getAccountBillingSummary } from '@de-care/domains/account/state-account';
import { selectFeature, getTrialRadioAccountSubscriptionlast4DigitsOfRadioId, getRadioIdToReplace, getPaymentType, getMode } from './state.selectors';
import { Mode } from '../reducer';

export const selectAccountData = createSelector(selectAccount, (account) => (account ? { account, isNewAccount: false, hasEmailAddressOnFile: true } : null));
export const getHasNoActiveCardOnFile = createSelector(getAccountBillingSummary, (billingSummary) => {
    return (
        !billingSummary?.creditCard ||
        !billingSummary?.creditCard?.type ||
        billingSummary?.creditCard?.status === 'ABOUT_TO_EXPIRE' ||
        billingSummary?.creditCard?.status === 'EXPIRED'
    );
});
export const getHasNoInvoiceOrActiveCardOnFile = createSelector(
    getAccountBillingSummary,
    getHasNoActiveCardOnFile,
    (billingSummary, hasNoCard) => hasNoCard && !billingSummary?.isPaymentTypeInvoice
);
export const getLoadQuoteDataAsProcessing = createSelector(selectFeature, (state) => state.loadQuoteDataAsProcessing);

export const getDataForLoadQuotes = createSelector(
    selectFeature,
    getMode,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getRadioIdToReplace,
    getPaymentType,
    ({ selectedPlanCode }, mode, trialRadioId, selfPayRadioId, paymentType) => ({
        transactionType: mode,
        followOnPlanCodes: [selectedPlanCode],
        trialRadioId,
        selfPayRadioId: mode === Mode.ServiceContinuity || mode === Mode.ServicePortability ? selfPayRadioId : null,
        paymentType,
    })
);
