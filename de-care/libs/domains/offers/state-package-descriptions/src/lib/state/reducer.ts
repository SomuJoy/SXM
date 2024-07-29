import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PackageDescriptionModel, locales } from './models';
import { setPackageDescriptions, setCurrentLocale } from './actions';
import { resetPackageDescriptionsStateToInitial } from './public.actions';
import { createEntityCompositeKey } from './helpers';

export const featureKey = 'packageDescriptionsFeature';

export interface PackageDescriptionsState extends EntityState<PackageDescriptionModel> {
    currentLocale: locales;
}

export const adapter: EntityAdapter<PackageDescriptionModel> = createEntityAdapter<PackageDescriptionModel>({
    selectId: entity => createEntityCompositeKey(entity.packageName, entity.locale)
});

export const initialState: PackageDescriptionsState = adapter.getInitialState({
    currentLocale: null
});

const featureReducer = createReducer(
    initialState,
    on(setCurrentLocale, (state, { locale }) => ({ ...state, currentLocale: locale })),
    on(setPackageDescriptions, (state, { packageDescriptions }) => adapter.upsertMany(packageDescriptions, state)),
    on(resetPackageDescriptionsStateToInitial, state => ({ ...initialState, currentLocale: state.currentLocale }))
);

export function reducer(state: PackageDescriptionsState, action: Action) {
    return featureReducer(state, action);
}
