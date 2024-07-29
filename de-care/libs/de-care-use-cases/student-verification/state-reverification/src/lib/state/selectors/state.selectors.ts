import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { getOACUrl } from '@de-care/settings';
import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';

export const selectStudentReverificationPageData = createSelector(selectFeature, (state) => state?.studentReVerificationFlowPageState);

export const getOACLoginRedirectUrl = createSelector(getOACUrl, getLanguagePrefix, (url, lang) => {
    const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
    return `${url}login_view.action?reset=true${langPref}`;
});
