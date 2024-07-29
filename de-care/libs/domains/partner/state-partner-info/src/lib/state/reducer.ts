import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { partnerInfoLoaded, fallBackCorpIdLoaded } from './actions';
import { PartnerInfo, PartnerInfoState } from './models';

/**
 * Why an Entity?
 *
 * Entities allow us to manage data as an indexed array: It is optimized for both iteration and lookups.
 * Partner data is represented as a list of partners, and we currently want to look then up by id, so it makes sense to use a Map.
 *
 * However we might want to render a list of partners as well in future - this allows us the flexibility to
 * be able to do both. The overhead is minimal.
 */

export const featureKey = 'partnerInfo';

export function getCorpIdFromPartner(partnerInfo: PartnerInfo): number {
    return partnerInfo.corpId;
}

export const adapter: EntityAdapter<PartnerInfo> = createEntityAdapter<PartnerInfo>({
    selectId: getCorpIdFromPartner
});

export const initialState: PartnerInfoState = adapter.getInitialState({
    fallbackCorpId: null,
    isInitialized: false
});

const partnerInfoReducer = createReducer(
    initialState,

    on(partnerInfoLoaded, (state, action) => {
        const newState = { ...state, isInitialized: true };
        return adapter.setAll(action.partners, newState);
    }),

    on(fallBackCorpIdLoaded, (state, action) => ({
        ...state,
        fallbackCorpId: action.fallbackCorpId
    }))
);

export function reducer(state: PartnerInfoState, action: Action) {
    return partnerInfoReducer(state, action);
}
