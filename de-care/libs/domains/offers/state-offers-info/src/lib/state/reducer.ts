import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as Actions from './actions';
import { resetOffersInfoStateToInitial, setRecapDescriptionForOffers } from './public.actions';
import { createEntityCompositeKey, normalizeLangToLocale } from '../helpers';

export interface OfferInfoModel {
    locale: string;
    planCode: string;
    salesHero?: SalesHero;
    offerDescription: OfferDescription;
    offerDetails?: string[] | string; // TODO: Remove string[] once endpoint is updated to be returning single offerDetails string value
    deals?: Deal[];
    packageDescription: PackageDescription;
    addonHeaderOverride?: string;
    presentation: Presentation;
    numberOfBullets?: number;
}
export interface SalesHero {
    title: string;
    subTitle: string;
    presentation: object;
}
export interface OfferDescription {
    priceAndTermDescTitle: string;
    processingFeeDisclaimer?: string;
    recapDescription?: string;
    recapLongDescription?: string;
}
export interface Deal {
    description: string;
    deviceImage: string;
    productImage: string;
    header: string;
    name: string;
    title: string;
    addonShowToggleText: string;
    addonHideToggleText: string;
    presentation?: string;
}
export interface PackageDescription {
    packageName: string;
    highlightsTitle: string;
    highlightsText: string[];
    listeningOptions: string[];
    longDescription?: string;
    icons?: { inside: ListenOnModel; outside: ListenOnModel; pandora: ListenOnModel; vip?: ListenOnModel };
    footer: string;
    packageFeatures: PackageFeature[];
    promoFooter?: string;
    packageHideToggleText: string;
    packageShowToggleText: string;
}
export interface PackageFeature {
    packageName: string;
    features: {
        name: string;
        tooltipText: string;
        shortDescription: string;
        learnMoreLinkText: string;
        learnMoreInformation: string;
    }[];
}
export interface ListenOnModel {
    isActive: boolean;
    label: string;
}
export interface Presentation {
    theme: string;
    style: string;
}
export interface PlanCodeInfo {
    leadOfferPlanCode?: string;
    followOnPlanCode?: string;
    renewalPlanCodes?: string[];
}

export const featureKey = 'offersInfoFeature';

export interface OffersInfoState extends EntityState<OfferInfoModel> {
    currentLocale: string;
}

export const adapter: EntityAdapter<OfferInfoModel> = createEntityAdapter<OfferInfoModel>({
    selectId: (offerInfo) => createEntityCompositeKey(offerInfo.planCode, offerInfo.locale),
});

export const initialState: OffersInfoState = adapter.getInitialState({
    currentLocale: '',
});

const featureReducer = createReducer(
    initialState,
    on(Actions.setCurrentLocale, (state, { locale }) => ({ ...state, currentLocale: normalizeLangToLocale(locale) })),
    on(Actions.setOfferInfoForOffers, (state, { offersInfo }) => adapter.upsertMany(offersInfo, state)),
    on(Actions.removeAllOfferInfoForOffers, (state) => adapter.removeAll(state)),
    on(Actions.setOfferInfo, (state, { offerInfo }) => adapter.setOne(offerInfo, state)),
    on(resetOffersInfoStateToInitial, (state) => ({ ...initialState, currentLocale: state.currentLocale })),
    on(setRecapDescriptionForOffers, (state, { offersInfo }) => {
        const items: any = offersInfo.map((i) => {
            const id = createEntityCompositeKey(i.planCode, normalizeLangToLocale(i.locale));
            return {
                id,
                changes: {
                    packageDescription: {
                        ...state.entities[id]?.packageDescription,
                        recapDescription: i.recapDescription,
                        recapLongDescription: i.recapLongDescription,
                    },
                },
            };
        });
        return adapter.updateMany(items, state);
    })
);

export function reducer(state: OffersInfoState, action: Action) {
    return featureReducer(state, action);
}
