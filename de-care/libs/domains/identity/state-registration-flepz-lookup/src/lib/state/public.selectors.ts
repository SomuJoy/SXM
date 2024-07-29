import { createSelector } from '@ngrx/store';
import { selectRegistrationFlepzLookupFeature } from './selectors';

export const getRegistrationFlepzLookupAccountsAsArray = createSelector(selectRegistrationFlepzLookupFeature, ({ accounts }) => (Array.isArray(accounts) ? accounts : []));
