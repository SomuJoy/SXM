import { createSelector } from '@ngrx/store';
import { selectAccount } from '@de-care/domains/account/state-account';
import { getShouldUseCardOnFile, getPaymentInfo } from './state.selectors';
import { CreditCardHelper } from '@de-care/sxm-ui';

export const selectAccountData = createSelector(selectAccount, account => ({ account, isNewAccount: false, hasEmailAddressOnFile: !!account.email }));

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
