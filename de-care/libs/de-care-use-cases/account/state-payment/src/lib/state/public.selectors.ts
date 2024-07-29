import { getCurrentQuoteReactivationFee, getCurrentQuoteRemainingServiceBalanceFee, getCurrentQuoteRoyaltyFee, getCurrentQuoteTax } from '@de-care/domains/quotes/state-quote';

import { getIsQuebec, getIsCanada } from '@de-care/domains/account/state-account';
import { selectAccount, getPersonalInfoSummary, getInactiveSubscriptionsRadioIds } from '@de-care/domains/account/state-account';
import { createSelector } from '@ngrx/store';
import { getCollectedPaymentInfo, getTransactionId, isUpdatePaymentProcessSuccessful } from './selectors';
import { getConfirmationDataReady, isPaymentProcessSuccessful } from './selectors';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

export const getInfoForReactivationQuote = createSelector(
    getCurrentQuoteReactivationFee,
    getCurrentQuoteRoyaltyFee,
    getCurrentQuoteRemainingServiceBalanceFee,
    getCurrentQuoteTax,
    (reactivationQuoteFee, royaltyFee, remainingServiceBalanceFee, stateTax) => ({ reactivationQuoteFee, royaltyFee, remainingServiceBalanceFee, stateTax })
);
export const getAccountHasSuspendedSubscriptions = createSelector(selectAccount, (account) =>
    account?.subscriptions?.map((subs) => subs?.hasInactiveServiceDueToNonPay)?.some((suspended) => !!suspended)
);

export const getIsUpdatePaymentMethodOnly = createSelector(
    selectAccount,
    getNormalizedQueryParams,
    getAccountHasSuspendedSubscriptions,
    ({ billingSummary }, { updatepayment }, hasSuspendedSubscriptions) => {
        const paymentTypeIsCreditCard = !!billingSummary?.creditCard && !billingSummary?.isPaymentTypeInvoice;
        const hasNoPaymentDue = !billingSummary.amountDue && !billingSummary.nextPaymentAmount;
        const hasUpdatePaymentInParams = updatepayment === 'true';
        const hasNextPaymentWithCreditCardPaymentType = paymentTypeIsCreditCard && !billingSummary.amountDue && billingSummary.nextPaymentAmount;
        /**
         * If Account has no suspended subscriptions due to non pay.
         * or If We have ?updatePayment=true in the query params.
         * or If Account has no current and next payment due.
         * or If Account has only next payment due with creditCard Type Payment.
         */
        return !hasSuspendedSubscriptions && (hasUpdatePaymentInParams || hasNoPaymentDue || hasNextPaymentWithCreditCardPaymentType);
    }
);

export const getInfoToMakePaymentViewModel = createSelector(
    selectAccount,
    getInfoForReactivationQuote,
    getIsUpdatePaymentMethodOnly,
    (account, { reactivationQuoteFee, royaltyFee, remainingServiceBalanceFee, stateTax }, isUpdatePaymentMethodOnly) => {
        const billingSummary = account?.billingSummary;
        const paymentTypeIsCreditCard = !!billingSummary?.creditCard && !billingSummary?.isPaymentTypeInvoice;
        const currentBalanceDue = account.billingSummary?.amountDue;
        const nextPaymentAmount = paymentTypeIsCreditCard ? 0 : account.billingSummary?.nextPaymentAmount;
        const nextPaymentDueDate = account.billingSummary?.nextPaymentDate;
        const accountHasSuspendedSubscriptions = account?.subscriptions?.map((subs) => subs?.hasInactiveServiceDueToNonPay)?.some((suspended) => !!suspended);
        const reactivationAmount = reactivationQuoteFee || 0;
        const totalAmountDue = currentBalanceDue + nextPaymentAmount + reactivationAmount;
        const canSelectAmountToPay = !!currentBalanceDue && !!nextPaymentAmount;
        const hasCurrentBalanceDue = !!currentBalanceDue && !accountHasSuspendedSubscriptions;
        const hasNoCurrentBalanceDue = !currentBalanceDue && !!nextPaymentAmount;
        return {
            accountPresence: {
                customerName: account?.firstName,
                accountNumber: account?.accountNumber,
            },
            amounts: {
                currentBalanceDue,
                nextPaymentAmount,
                totalAmountDue,
                nextPaymentDueDate,
                reactivationAmount,
                royaltyFee,
                stateTax,
                remainingServiceBalanceFee,
            },
            canSelectPaymentFrequency: billingSummary?.isPaymentTypeInvoice,
            canSelectAmountToPay,
            hasCurrentBalanceDue,
            hasNoCurrentBalanceDue,
            accountHasSuspendedSubscriptions,
            isUpdatePaymentMethodOnly,
            withoutFees: account?.serviceAddress?.state === 'QC',
        };
    }
);

export const getOptionsSelectorsToDisplay = createSelector(getInfoToMakePaymentViewModel, (model) => ({
    optionsAmountToPay: model.canSelectAmountToPay,
    optionsPaymentFrequency: model.canSelectPaymentFrequency,
}));

export const getPaymentProcessRequest = createSelector(getCollectedPaymentInfo, getTransactionId, (paymentInfo, transactionId) => {
    const freqOption = paymentInfo.paymentFrequencyOption;
    return {
        paymentAmount: paymentInfo.paymentAmountOption,
        transactionId,
        oneTimePayment: freqOption === 'oneTime' || !freqOption,
        cardInfo: {
            cardNumber: paymentInfo.cardNumber,
            expiryMonth: parseInt(paymentInfo?.expirationDate?.split('/')[0], 10),
            expiryYear: parseInt(paymentInfo?.expirationDate?.split('/')[1], 10),
            nameOnCard: paymentInfo.nameOnCard,
            securityCode: paymentInfo.cvv,
            cardType: paymentInfo.cardType,
        },
        billingAddress: {
            avsvalidated: paymentInfo.avsValidated,
            streetAddress: paymentInfo.addressLine1,
            city: paymentInfo.city,
            state: paymentInfo.state,
            postalCode: paymentInfo.zip,
            country: paymentInfo.country,
        },
    };
});

export const getUpdatePaymentRequest = createSelector(getCollectedPaymentInfo, getTransactionId, (paymentInfo, transactionId) => {
    return {
        paymentType: 'creditCard',
        transactionId,
        cardInfo: {
            cardNumber: paymentInfo.cardNumber,
            expiryMonth: parseInt(paymentInfo?.expirationDate?.split('/')[0], 10),
            expiryYear: parseInt(paymentInfo?.expirationDate?.split('/')[1], 10),
            nameOnCard: paymentInfo.nameOnCard,
            securityCode: paymentInfo.cvv,
            cardType: paymentInfo.cardType,
        },
        billingAddress: {
            avsvalidated: paymentInfo.avsValidated,
            streetAddress: paymentInfo.addressLine1,
            city: paymentInfo.city,
            state: paymentInfo.state,
            postalCode: paymentInfo.zip,
            country: paymentInfo.country,
        },
    };
});

export const getConfirmationPageViewModel = createSelector(
    getPaymentProcessRequest,
    getPersonalInfoSummary,
    getInactiveSubscriptionsRadioIds,
    getInfoToMakePaymentViewModel,
    selectAccount,
    getIsQuebec,
    getIsCanada,
    isUpdatePaymentProcessSuccessful,
    (paymentReqInfo, personalInfo, inactiveSubscriptionsRadioIds, accountInfo, account, isQuebec, isCanada, isUpdatePaymentMethodOnly) => {
        const billingAddress = paymentReqInfo?.billingAddress;
        const cardInfo = paymentReqInfo?.cardInfo;
        const nextPaymentAmount = account.billingSummary?.nextPaymentAmount;
        const currentBalanceDue = account.billingSummary?.amountDue;
        const hasNoCurrentBalanceDue = !currentBalanceDue && !!nextPaymentAmount;
        const hasPaidNextPaymentAmount = hasNoCurrentBalanceDue && paymentReqInfo.paymentAmount === nextPaymentAmount;

        return {
            userName: personalInfo?.firstName,
            phone: account?.phone,
            copiesExcludeFees: isQuebec,
            useFullPostalCode: isCanada,
            accountNumber: account.accountNumber,
            paymentAmount: paymentReqInfo.paymentAmount,
            emailAddress: personalInfo?.email?.toLowerCase(),
            accountHasSuspendedSubscriptions: accountInfo?.accountHasSuspendedSubscriptions,
            inactiveSubscriptionsRadioIds,
            hasPaidNextPaymentAmount,
            billingDetails: {
                streetAddress: billingAddress?.streetAddress,
                city: billingAddress?.city,
                state: billingAddress?.state,
                postalCode: billingAddress?.postalCode,
            },
            cardInfo: {
                nameOnCard: cardInfo?.nameOnCard,
                cardType: paymentReqInfo.cardInfo.cardType,
                maskedCardNumber: cardInfo?.cardNumber?.slice(-4),
                expires: ('00' + cardInfo?.expiryMonth)?.slice(-2) + '/' + (cardInfo?.expiryYear ? 2000 + cardInfo.expiryYear : ''),
            },
            isUpdatePaymentMethodOnly,
        };
    }
);

export const confirmationPageReady = createSelector(
    getConfirmationDataReady,
    isPaymentProcessSuccessful,
    isUpdatePaymentProcessSuccessful,
    (dataReady, proccessSuccessful, updateProcessSuccessful) => dataReady && (proccessSuccessful || updateProcessSuccessful)
);
