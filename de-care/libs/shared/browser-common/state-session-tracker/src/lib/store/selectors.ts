// ===============================================================================
// Internal Features (Store)
import { AppRootState } from './state';
import { CoreConstant } from '@de-care/shared/legacy-core/core-constants';

// ===============================================================================
// External Features (Data Services)
// import { OfferModel } from '../../data-services';

// ===============================================================================
// Libs
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const getAppRootState: MemoizedSelector<object, AppRootState> = createFeatureSelector<AppRootState>(CoreConstant.STORE.NAME);

export const getSessionTimedOut: MemoizedSelector<object, boolean> = createSelector(getAppRootState, (state: AppRootState) => state.sessionTimedOut);
