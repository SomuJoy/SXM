import { createAction, props } from '@ngrx/store';

export const behaviorEventReactionAppPlatform = createAction('[Behavior Event] Reaction - App platform', props<{ platform: 'android' | 'ios' | 'web' | 'unknown' }>());
export const behaviorEventReactionBuildVersion = createAction('[Behavior Event] Reaction - Build Version', props<{ buildVersion: string }>());
