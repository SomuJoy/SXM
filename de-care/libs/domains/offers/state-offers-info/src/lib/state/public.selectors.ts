import { createSelector } from '@ngrx/store';
import { getPlanCodeFromCompositeKey, getDealDescriptionSplitHidden, getDealDescriptionSplitShown } from '../helpers';
import { getCurrentLocale, selectEntities } from './state.selectors';

export const selectOfferInfosForCurrentLocaleMappedByPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => {
    return Object.keys(offersInfo).reduce((set, key) => {
        if (key.endsWith(locale)) {
            return { ...set, [getPlanCodeFromCompositeKey(key)]: offersInfo[key] };
        }
        return set;
    }, []);
});

export const selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => {
    return Object.keys(offersInfo).reduce((set, key) => {
        if (key.endsWith(locale)) {
            const { title, subTitle: subtitle, presentation } = offersInfo[key]?.salesHero || {};
            const data = {
                title,
                subtitle, // Note: subTitle (capital T) from the MS response is being converted to subtitle (lowercase t) how it's named in Angular
                presentation,
            };
            return { ...set, [getPlanCodeFromCompositeKey(key)]: data };
        }
        return set;
    }, []);
});
export const selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => {
    return Object.keys(offersInfo).reduce((set, key) => {
        if (key.endsWith(locale)) {
            const { offerDescription, packageDescription, presentation } = offersInfo[key] || {};
            const data = offerDescription
                ? {
                      platformPlan: packageDescription?.packageName,
                      priceAndTermDescTitle: offerDescription?.priceAndTermDescTitle,
                      processingFeeDisclaimer: offerDescription?.processingFeeDisclaimer,
                      longDescription: packageDescription?.longDescription,
                      icons: packageDescription?.icons,
                      detailsTitle: packageDescription?.highlightsTitle,
                      details: packageDescription?.highlightsText,
                      footer: packageDescription?.footer,
                      packageFeatures: packageDescription?.packageFeatures,
                      promoFooter: packageDescription?.promoFooter,
                      toggleCollapsed: packageDescription?.packageShowToggleText,
                      toggleExpanded: packageDescription?.packageHideToggleText,
                      theme: presentation?.theme,
                      presentation: presentation?.style,
                      recapDescription: offerDescription?.recapDescription,
                      recapLongDescription: offerDescription?.recapLongDescription,
                  }
                : null;
            return { ...set, [getPlanCodeFromCompositeKey(key)]: data };
        }
        return set;
    }, []);
});

export const selectOfferInfoDealAddonForCurrentLocaleMappedByPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => {
    return Object.keys(offersInfo).reduce((set, key) => {
        if (key.endsWith(locale)) {
            if (offersInfo[key]?.deals && Array.isArray(offersInfo[key]?.deals)) {
                const { deals, addonHeaderOverride } = offersInfo[key] || {};
                const data = deals?.map((deal) => ({
                    marketingCallout: addonHeaderOverride || deal.header,
                    title: deal.title,
                    partnerImage: deal.deviceImage,
                    productImage: deal.productImage,
                    description: getDealDescriptionSplitHidden(deal.description),
                    shownDescription: getDealDescriptionSplitShown(deal.description),
                    // TODO: remove this description split if CMS changes this to be two properties instead
                    toggleCollapsed: deal.addonShowToggleText,
                    toggleExpanded: deal.addonHideToggleText,
                    presentation: deal?.presentation,
                }));
                return { ...set, [getPlanCodeFromCompositeKey(key)]: data };
            }
        }
        return set;
    }, []);
});

export const selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => {
    return Object.keys(offersInfo).reduce((set, key) => {
        if (key.endsWith(locale)) {
            return { ...set, [getPlanCodeFromCompositeKey(key)]: offersInfo[key]?.offerDetails };
        }
        return set;
    }, []);
});
