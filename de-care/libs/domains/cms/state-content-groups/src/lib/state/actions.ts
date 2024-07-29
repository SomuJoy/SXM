import { createAction, props } from '@ngrx/store';
import { ContentGroup } from './models';

export const setContentGroup = createAction('[CMS Content Groups] Set content group', props<{ contentGroup: ContentGroup }>());
