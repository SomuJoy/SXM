import { createSelector } from '@ngrx/store';
import { selectFlepzLookupFeature } from './reducer';

export const getFlepzLookupSubscriptions = createSelector(selectFlepzLookupFeature, ({ subscriptions }) => subscriptions);
