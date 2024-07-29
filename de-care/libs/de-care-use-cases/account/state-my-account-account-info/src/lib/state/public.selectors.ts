import { getAccountUsername, selectAccount, getAccountAccountNumber } from '@de-care/domains/account/state-account';
import { createSelector } from '@ngrx/store';
import { getAccountBillingAddressSameAsService, getContactInfoData, getPrimarySubscriptionPlanName } from './selectors';
import { toTitleCase } from '@de-care/shared/browser-common/util-common';
import { getPaymentInfoSectionData } from '@de-care/de-care-use-cases/account/state-common';
import { getContactPreferences } from '@de-care/domains/account/state-management';

export { getAccountUsername } from '@de-care/domains/account/state-account';

export const getAccountContactInfoDetails = createSelector(selectAccount, getAccountBillingAddressSameAsService, (account, billingAddressSameAsService) => ({
    firstName: toTitleCase(account?.firstName),
    lastName: toTitleCase(account?.lastName),
    phoneNumber: account?.phone,
    email: account?.email?.toLowerCase(),
    billingAddressSameAsService: billingAddressSameAsService,
    serviceAddress: { ...account?.serviceAddress, streetAddress: toTitleCase(account?.serviceAddress?.streetAddress), city: toTitleCase(account?.serviceAddress?.city) },
}));

export const getAccountInformationVM = createSelector(
    getContactInfoData,
    getPaymentInfoSectionData,
    getAccountUsername,
    getAccountAccountNumber,
    getPrimarySubscriptionPlanName,
    (contactInfo, paymentInfoSectionData, username, accountNumber, planName) => ({
        contactInfo,
        paymentMethod: paymentInfoSectionData?.paymentMethod,
        billingAddress: paymentInfoSectionData?.billingAddress,
        eBill: paymentInfoSectionData?.eBill,
        username,
        accountNumber,
        planName,
    })
);

export const getEditBillingAddressDetails = createSelector(getPaymentInfoSectionData, (paymentInfoSectionData) => ({
    billingAddress: paymentInfoSectionData?.billingAddress,
}));

export const getAccountEmail = createSelector(getContactInfoData, (contactInfo) => contactInfo?.email);
export const getContactPreferencesDetails = createSelector(getContactPreferences, (contactPreferences) => contactPreferences);
