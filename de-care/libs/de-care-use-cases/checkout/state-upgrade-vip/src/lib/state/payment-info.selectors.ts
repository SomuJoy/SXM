import { createSelector } from '@ngrx/store';
import { selectAccount } from '@de-care/domains/account/state-account';
import { selectedPaymentMethod, getPaymentInfo } from './selectors';
import { CreditCardHelper } from '@de-care/sxm-ui';

export const selectAccountData = createSelector(selectAccount, account => {
    if (account) {
        return {
            account,
            isNewAccount: false,
            hasEmailAddressOnFile: account.hasOwnProperty('hasEmailAddressOnFile') ? account.hasEmailAddressOnFile : !!account.email
            //The ideal solution would be to have MS return the hasEmailAddressOnFile on both the account and token services
        };
    }
    return null;
});

export const selectedPaymentMethodViewModel = createSelector(selectedPaymentMethod, selectAccountData, getPaymentInfo, (paymentMethod, { account }, newCard) => {
    if (paymentMethod === 'cardOnFile') {
        const cardType = account?.billingSummary?.creditCard?.type;
        const lastFourDigitsOfCard = account?.billingSummary?.creditCard?.last4Digits;

        return { cardType, lastFourDigitsOfCard };
    } else if (paymentMethod === 'newCard') {
        const cardType = CreditCardHelper.cardFromNumber(newCard.ccNum).type;
        const lastFourDigitsOfCard = newCard.ccNum.toString().slice(-4);

        return { cardType, lastFourDigitsOfCard };
    }
});
