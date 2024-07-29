import { createSelector } from '@ngrx/store';
import { getQuote, getCurrentQuote } from '@de-care/domains/quotes/state-quote';
import { selectFeature, getTrialRadioAccountSubscriptionlast4DigitsOfRadioId, getRadioIdToReplace, getCountryCodeForPaymentInfo, getMode } from './state.selectors';
import { getPersonalInfoSummary, getIsClosedRadio } from '@de-care/domains/account/state-account';
import { Mode } from '../reducer';

export const getOrderSummaryData = createSelector(getQuote, getIsClosedRadio, (quotes, isClosedRadio) => {
    return { quotes, isClosedRadio };
});
export const getSubmitTransactionAsProcessing = createSelector(selectFeature, (state) => state.submitTransactionAsProcessing);

export const getServiceContinuityData = createSelector(
    selectFeature,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getRadioIdToReplace,
    getPersonalInfoSummary,
    getCurrentQuote,
    getCountryCodeForPaymentInfo,
    getMode,
    ({ selectedPlanCode, useCardOnFile, paymentInfo, paymentType, removeOldRadioId, transactionId }, trialRadioId, selfPayRadioId, account, currentQuote, country, mode) => {
        const address = {
            phone: account?.phone,
            avsvalidated: false,
            streetAddress: paymentInfo?.billingAddress?.addressLine1,
            city: paymentInfo?.billingAddress?.city,
            state: paymentInfo?.billingAddress?.state,
            postalCode: paymentInfo?.billingAddress?.zip,
            country: paymentInfo?.country ?? country,
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
        };
        const scData = {
            trialRadioId,
            selfPayRadioId,
            followOnPlans: selectedPlanCode ? [{ planCode: selectedPlanCode }] : [],
            removeCarFromAccount: removeOldRadioId,
            transactionType: mode === Mode.ServiceContinuity || mode === Mode.ServicePortability ? mode : null,
        };
        if (paymentType === 'invoice' || useCardOnFile) {
            return { ...scData, paymentInfo: { useCardOnfile: useCardOnFile, paymentType, transactionId } };
        } else {
            return {
                ...scData,
                paymentInfo: {
                    useCardOnfile: useCardOnFile,
                    paymentType,
                    transactionId,
                    cardInfo: {
                        cardNumber: paymentInfo?.ccNum,
                        expiryMonth: paymentInfo?.ccExpDate?.split('/')[0],
                        expiryYear: paymentInfo?.ccExpDate?.split('/')[1],
                        nameOnCard: paymentInfo?.ccName,
                    },
                    paymentAmount:
                        currentQuote &&
                        (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') &&
                        Math.sign(currentQuote.currentBalance + 0) === 1
                            ? currentQuote.currentBalance
                            : null,
                },
                billingAddress: address,
            };
        }
    }
);
