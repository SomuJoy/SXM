import { createSelector } from '@ngrx/store';
import { selectEntities } from './selectors';

export const getContentGroupsMappedByContentGroupId = createSelector(selectEntities, (contentGroups) => contentGroups);
export const getContentGroupByName = (name: string) =>
    createSelector(getContentGroupsMappedByContentGroupId, (contentGroups) =>
        contentGroups ? Object.values(contentGroups).find((contentGroup) => contentGroup.name === name) : null
    );
