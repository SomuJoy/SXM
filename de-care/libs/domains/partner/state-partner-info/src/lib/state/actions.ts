import { createAction, props } from '@ngrx/store';
import { PartnerInfo } from './models';

export const loadPartnerInfo = createAction('[Partner info] Load Partner info');
export const partnerInfoLoaded = createAction('[Partner info] Partner info loaded', props<{ partners: PartnerInfo[] }>());
export const fallBackCorpIdLoaded = createAction('[Partner info] Fallback corpId loaded', props<{ fallbackCorpId: number | null }>());
