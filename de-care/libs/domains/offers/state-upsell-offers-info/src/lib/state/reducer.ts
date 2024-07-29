import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { createEntityCompositeKey } from '../../helpers';
import * as Actions from './actions';
import { normalizeLangToLocale } from '@de-care/domains/offers/state-offers-info-common';
import { clearUpsellOffersInfo } from './public.actions';

export interface UpsellOfferInfoModel {
    locale: string;
    leadOfferPlanCode: string;
    packageUpsellOfferInfo: PackageContentModel;
    termUpsellOfferInfo: TermContentModel;
    packageAndTermUpsellOfferInfo: {
        packageUpsellOfferInfo: PackageContentModel;
        termUpsellOfferInfo: TermContentModel;
    };
}
export interface PackageContentModel {
    header?: string;
    title?: string;
    description?: string;
    packageDescription?: PackageContentPackageDescriptionModel;
    toggleCollapsed?: string;
    toggleExpanded?: string;
    upsellDeals?: DealContentModel[];
}
export interface TermContentModel {
    title?: string;
    copy?: string;
    descriptionTitle?: string;
    description?: string;
    toggleCollapsed?: string;
    toggleExpanded?: string;
    upsellDeals?: DealContentModel[];
}
export interface PackageContentPackageDescriptionModel {
    descriptionTitle?: string;
    listeningOptions?: { inside: ListenOnModel; outside: ListenOnModel; pandora: ListenOnModel };
    highlightsText?: string[];
}
export interface ListenOnModel {
    isActive: boolean;
    label: string;
}
export interface DealContentModel {
    name: string;
    header: string;
    deviceImage?: string;
}

export const featureKey = 'upsellOffersInfoFeature';

export interface UpsellOffersInfoState extends EntityState<UpsellOfferInfoModel> {
    currentLocale: string;
}

export const adapter: EntityAdapter<UpsellOfferInfoModel> = createEntityAdapter<UpsellOfferInfoModel>({
    selectId: (upsellOfferInfo) => createEntityCompositeKey(upsellOfferInfo.leadOfferPlanCode, upsellOfferInfo.locale),
});

export const initialState: UpsellOffersInfoState = adapter.getInitialState({
    currentLocale: '',
});

const featureReducer = createReducer(
    initialState,
    on(Actions.setCurrentLocale, (state, { locale }) => ({ ...state, currentLocale: normalizeLangToLocale(locale) })),
    on(Actions.setUpsellOfferInfoForUpsellOffers, (state, { upsellOffersInfo }) => adapter.setAll(upsellOffersInfo, state)),
    on(clearUpsellOffersInfo, (state) => adapter.removeAll(state))
);

export function reducer(state: UpsellOffersInfoState, action: Action) {
    return featureReducer(state, action);
}
