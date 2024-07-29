import { createSelector } from '@ngrx/store';
import { selectAccount } from '@de-care/domains/account/state-account';
import { getShouldUseCardOnFile, getPaymentInfo } from './state.selectors';
import { CreditCardHelper } from '@de-care/sxm-ui';

export const selectAccountData = createSelector(selectAccount, account => {
    return {
        account,
        isNewAccount: false,
        hasEmailAddressOnFile: account.hasOwnProperty('hasEmailAddressOnFile') ? account.hasEmailAddressOnFile : !!account.email
        //The ideal solution would be to have MS return the hasEmailAddressOnFile on both the account and token services
    };
});

export const getPaymentInfoForInactiveStep = createSelector(getShouldUseCardOnFile, selectAccountData, getPaymentInfo, (useCardOnFile, { account }, paymentInfo) => {
    if (useCardOnFile) {
        const cardType = account?.billingSummary?.creditCard?.type;
        const cardNumber = account?.billingSummary?.creditCard?.last4Digits;

        return { cardType, cardNumber };
    } else {
        const cardType = CreditCardHelper.cardFromNumber(paymentInfo.ccNum).type;
        const cardNumber = paymentInfo.ccNum.toString().slice(-4);

        return { cardType, cardNumber };
    }
});
