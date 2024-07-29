import { createSelector } from '@ngrx/store';
import { getCurrentLocale, selectEntities } from './selectors';
import { getPackageNameIdFromCompositeKey } from './helpers';

export const selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId = createSelector(getCurrentLocale, selectEntities, (currentLocale, packageDescriptions) => {
    return Object.keys(packageDescriptions).reduce((set, key) => {
        if (key.endsWith(currentLocale)) {
            // remove the extra prop(s) that we are just using internally in this lib via the spread operator
            const { locale, ...packageDescription } = packageDescriptions[key];
            return { ...set, [getPackageNameIdFromCompositeKey(key)]: packageDescription };
        }
        return set;
    }, []);
});
