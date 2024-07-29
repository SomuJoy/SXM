import { createAction, props } from '@ngrx/store';
import { StreamingOnboardingSettings } from './settings.interface';

export const setStreamingOnboardingSettings = createAction('[Streaming Onboarding Settings] Settings set', props<{ settings: StreamingOnboardingSettings }>());
