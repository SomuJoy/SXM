import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, getStreamingOnboardingSettingsReducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, getStreamingOnboardingSettingsReducer)]
})
export class DeStreamingOnboardingStateSettingsModule {}
