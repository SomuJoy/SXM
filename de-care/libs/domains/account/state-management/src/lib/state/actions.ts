import { createAction, props } from '@ngrx/store';
import { ContactPreferences, ModifySubscriptionOptions } from '../state/models';

export const setModifySubscriptionOptions = createAction(
    '[Account Management] Set modify subscription options',
    props<{
        subscriptionId: number | string;
        modifySubscriptionOptions: ModifySubscriptionOptions;
    }>()
);

export const setContactPreferencesData = createAction('[Account Management] Set contact preferences data', props<{ contactPreferences: ContactPreferences }>());
