import { selectUpsellOfferInfosForCurrentLocaleMappedByLeadOfferPlanCode } from '@de-care/domains/offers/state-upsell-offers-info';
import { getUpgrade } from '@de-care/purchase-state';
import { createSelector } from '@ngrx/store';
import { getLeadOfferPlanCode } from './purchase-triage.selectors';

const getUpsellOffersInfoForLeadOffer = createSelector(
    getLeadOfferPlanCode,
    selectUpsellOfferInfosForCurrentLocaleMappedByLeadOfferPlanCode,
    (planCode, offerInfos) => offerInfos[planCode] || null
);

const getUpsellPlanCodeOptions = createSelector(getUpgrade, ({ upgrade: upsellOffers }) => {
    const upsellPlanCodeOptions: {
        packageUpsellPlanCode?: string;
        termUpsellPlanCode?: string;
        packageAndTermUpsellPlanCode?: string;
        packageUpsellPackageName?: string;
        termUpsellPackageName?: string;
    } = {};
    upsellOffers?.reduce((set, offer) => {
        switch (offer.upsellType.toLowerCase()) {
            case 'package':
                set.packageUpsellPackageName = offer.packageName;
                set.packageUpsellPlanCode = offer.planCode;
                break;
            case 'term':
                set.termUpsellPackageName = offer.packageName;
                set.termUpsellPlanCode = offer.planCode;
                break;
            case 'packageandterm':
                set.packageUpsellPackageName = offer.packageName;
                set.packageAndTermUpsellPlanCode = offer.planCode;
                break;
        }
        return set;
    }, upsellPlanCodeOptions);
    return upsellPlanCodeOptions;
});

const getUpsellOffersInfoTermCopy = createSelector(getUpsellOffersInfoForLeadOffer, getUpsellPlanCodeOptions, (info, upsellPlanCodeOptions) => {
    const termUpsellOfferInfo = info?.termUpsellOfferInfo;
    const termUpsellOfferInfoWhenPackageSelected = info?.packageAndTermUpsellOfferInfo?.termUpsellOfferInfo;

    return {
        termCopyContent: {
            title: termUpsellOfferInfo?.title,
            copy: termUpsellOfferInfo?.copy,
            descriptionTitle: termUpsellOfferInfo?.descriptionTitle,
            description: termUpsellOfferInfo?.description,
            toggleCollapsed: termUpsellOfferInfo?.toggleCollapsed,
            toggleExpanded: termUpsellOfferInfo?.toggleExpanded,
            upsellDeals: termUpsellOfferInfo?.upsellDeals,
            packageName: upsellPlanCodeOptions?.termUpsellPackageName,
        },
        termCopyContentWhenPackageSelected: {
            title: termUpsellOfferInfoWhenPackageSelected?.title,
            copy: termUpsellOfferInfoWhenPackageSelected?.copy,
            descriptionTitle: termUpsellOfferInfoWhenPackageSelected?.descriptionTitle,
            description: termUpsellOfferInfoWhenPackageSelected?.description,
            toggleCollapsed: termUpsellOfferInfoWhenPackageSelected?.toggleCollapsed,
            toggleExpanded: termUpsellOfferInfoWhenPackageSelected?.toggleExpanded,
            upsellDeals: termUpsellOfferInfoWhenPackageSelected?.upsellDeals,
            packageName: upsellPlanCodeOptions?.termUpsellPackageName,
        },
    };
});

export const getSatelliteUpsellOffersVM = createSelector(
    getUpsellPlanCodeOptions,
    getUpsellOffersInfoForLeadOffer,
    getUpsellOffersInfoTermCopy,
    (upsellPlanCodeOptions, info, termCopy) => {
        const packageUpsellOfferInfo = info?.packageUpsellOfferInfo;
        const packageDescription = packageUpsellOfferInfo?.packageDescription;

        const packageUpsellOfferInfoWhenTermSelected = info?.packageAndTermUpsellOfferInfo?.packageUpsellOfferInfo;
        const packageDescriptionWhenTermSelected = packageUpsellOfferInfoWhenTermSelected?.packageDescription;

        return {
            upsellPlanCodeOptions,
            upsellCopy: {
                packageCopyContent: {
                    marketingCallout: packageUpsellOfferInfo?.header,
                    title: packageUpsellOfferInfo?.title,
                    copy: packageUpsellOfferInfo?.description,
                    descriptionTitle: packageDescription?.descriptionTitle,
                    highlights: Array.isArray(packageDescription?.highlightsText) ? packageDescription.highlightsText : [],
                    icons: packageDescription?.listeningOptions,
                    toggleCollapsed: packageUpsellOfferInfo?.toggleCollapsed,
                    toggleExpanded: packageUpsellOfferInfo?.toggleExpanded,
                    upsellDeals: packageUpsellOfferInfo?.upsellDeals,
                    packageName: upsellPlanCodeOptions?.packageUpsellPackageName,
                },
                packageCopyContentWhenTermSelected: {
                    marketingCallout: packageUpsellOfferInfoWhenTermSelected?.header,
                    title: packageUpsellOfferInfoWhenTermSelected?.title,
                    copy: packageUpsellOfferInfoWhenTermSelected?.description,
                    descriptionTitle: packageDescriptionWhenTermSelected?.descriptionTitle,
                    highlights: Array.isArray(packageDescriptionWhenTermSelected?.highlightsText) ? packageDescriptionWhenTermSelected.highlightsText : [],
                    icons: packageDescriptionWhenTermSelected?.listeningOptions,
                    toggleCollapsed: packageUpsellOfferInfoWhenTermSelected?.toggleCollapsed,
                    toggleExpanded: packageUpsellOfferInfoWhenTermSelected?.toggleExpanded,
                    upsellDeals: packageUpsellOfferInfoWhenTermSelected?.upsellDeals,
                    packageName: upsellPlanCodeOptions?.packageUpsellPackageName,
                },
                ...termCopy,
            },
        };
    }
);

export const getStreamingUpsellOffersVM = createSelector(
    getUpsellPlanCodeOptions,
    getUpsellOffersInfoForLeadOffer,
    getUpsellOffersInfoTermCopy,
    (upsellPlanCodeOptions, info, termCopy) => {
        const packageUpsellOfferInfo = info?.packageUpsellOfferInfo;
        const packageDescription = packageUpsellOfferInfo?.packageDescription;

        const packageUpsellOfferInfoWhenTermSelected = info?.packageAndTermUpsellOfferInfo;
        const packageDescriptionWhenTermSelected = packageUpsellOfferInfoWhenTermSelected?.packageDescription;

        return {
            upsellPlanCodeOptions,
            upsellCopy: {
                packageCopyContent: {
                    title: packageUpsellOfferInfo?.title,
                    copy: packageUpsellOfferInfo?.description,
                    highlights: Array.isArray(packageDescription?.highlightsText) ? packageDescription.highlightsText : [],
                    toggleCollapsed: packageUpsellOfferInfo?.toggleCollapsed,
                    toggleExpanded: packageUpsellOfferInfo?.toggleExpanded,
                    upsellDeals: packageUpsellOfferInfo?.upsellDeals,
                    packageName: upsellPlanCodeOptions?.packageUpsellPackageName,
                },
                packageCopyContentWhenTermSelected: {
                    title: packageUpsellOfferInfoWhenTermSelected?.title,
                    copy: packageUpsellOfferInfoWhenTermSelected?.description,
                    highlights: Array.isArray(packageDescriptionWhenTermSelected?.highlightsText) ? packageDescriptionWhenTermSelected.highlightsText : [],
                    toggleCollapsed: packageUpsellOfferInfoWhenTermSelected?.toggleCollapsed,
                    toggleExpanded: packageUpsellOfferInfoWhenTermSelected?.toggleExpanded,
                    upsellDeals: packageUpsellOfferInfoWhenTermSelected?.upsellDeals,
                    packageName: upsellPlanCodeOptions?.packageUpsellPackageName,
                },
                ...termCopy,
            },
        };
    }
);
