import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ContentGroup } from './models';
import { setContentGroup } from './actions';

export const featureKey = 'cmsContentGroupsFeature';

export const adapter: EntityAdapter<ContentGroup> = createEntityAdapter<ContentGroup>({
    selectId: (model) => model.id,
});
export const initialState: EntityState<ContentGroup> = adapter.getInitialState();
const featureReducer = createReducer(
    initialState,
    on(setContentGroup, (state, { contentGroup }) => adapter.setOne(contentGroup, state))
);
export function reducer(state: EntityState<ContentGroup>, action: Action) {
    return featureReducer(state, action);
}
