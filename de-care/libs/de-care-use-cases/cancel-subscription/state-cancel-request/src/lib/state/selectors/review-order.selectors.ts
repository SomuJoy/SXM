import { createSelector } from '@ngrx/store';
import { getOffersDataForAllOffers } from '@de-care/domains/offers/state-offers';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getPlanCodeForSubmission, getSubscriptionId, getPaymentInfo, getShouldUseCardOnFile, getTransactionId } from './state.selectors';
import { getPersonalInfoSummary } from '@de-care/domains/account/state-account';

export const getRequestDataForQuoteQuery = createSelector(getSubscriptionId, getPlanCodeForSubmission, (subscriptionId, planCode) => ({
    subscriptionId: subscriptionId.toString(),
    planCode
}));

export const getOrderSummaryData = createSelector(getQuote, getOffersDataForAllOffers, (quotes, offersData) => {
    return quotes ? { quotes, offersData } : null;
});

export const getChangeSubscriptionSubmitData = createSelector(
    getPaymentInfo,
    getTransactionId,
    getSubscriptionId,
    getPlanCodeForSubmission,
    getPersonalInfoSummary,
    getShouldUseCardOnFile,
    (paymentInfo, transactionId, subscriptionId, planCode, account, shouldUseCardOnFile) => {
        const address = {
            phone: account?.phone,
            avsvalidated: false,
            streetAddress: paymentInfo?.billingAddress?.addressLine1,
            city: paymentInfo?.billingAddress?.city,
            state: paymentInfo?.billingAddress?.state,
            postalCode: paymentInfo?.billingAddress?.zip,
            country: paymentInfo.country,
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email
        };

        return shouldUseCardOnFile
            ? {
                  subscriptionId: subscriptionId,
                  plans: [{ planCode }],
                  paymentInfo: {
                      useCardOnfile: shouldUseCardOnFile,
                      transactionId
                  }
              }
            : {
                  subscriptionId: subscriptionId,
                  plans: [{ planCode }],
                  paymentInfo: {
                      useCardOnfile: false,
                      paymentType: 'creditCard',
                      cardInfo: {
                          cardNumber: parseInt(paymentInfo?.ccNum, 10),
                          expiryMonth: paymentInfo?.ccExpDate?.split('/')[0],
                          expiryYear: parseInt(paymentInfo?.ccExpDate?.split('/')[1], 10),
                          nameOnCard: paymentInfo?.ccName
                      },
                      transactionId
                  },
                  billingAddress: address,
                  serviceAddress: address
              };
    }
);
