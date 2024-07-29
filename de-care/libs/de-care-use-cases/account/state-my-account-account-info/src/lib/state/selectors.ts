import { getAccountServiceAddress, getPrimarySubscriptionFirstPlan, selectAccount } from '@de-care/domains/account/state-account';
import { createSelector } from '@ngrx/store';
import {
    getAccountBillingAddress,
    getAccountBillingSummary,
    getAccountEmail,
    getAccountFirstName,
    getAccountLastName,
    getAccountPhone,
} from '@de-care/domains/account/state-account';
import { getPackageNameWithoutAnyPlatform, selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const getAccountBillingAddressSameAsService = createSelector(
    selectAccount,
    (account) =>
        (account?.serviceAddress?.streetAddress?.toUpperCase() === account?.billingAddress?.streetAddress?.toUpperCase() &&
            account?.serviceAddress?.city?.toUpperCase() === account?.billingAddress?.city?.toUpperCase() &&
            account?.serviceAddress?.state?.toUpperCase() === account?.billingAddress?.state?.toUpperCase() &&
            account?.serviceAddress?.postalCode?.toUpperCase() === account?.billingAddress?.postalCode?.toUpperCase()) ||
        false
);

export const getContactInfoData = createSelector(
    getAccountFirstName,
    getAccountLastName,
    getAccountPhone,
    getAccountEmail,
    getAccountServiceAddress,
    (firstName, lastName, phone, email, serviceAddress) => ({
        name: `${firstName} ${lastName}`,
        phone,
        email,
        address: {
            ...serviceAddress,
            addressLine1: serviceAddress?.streetAddress,
            zip: serviceAddress?.postalCode,
        },
    })
);

// TODO: may need some logic to determine if we should show copy indicating platinum plan
export const getPrimarySubscriptionPlanName = createSelector(
    getPrimarySubscriptionFirstPlan,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (plan, allPackageDescriptions) => getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan?.packageName]?.name)
);
