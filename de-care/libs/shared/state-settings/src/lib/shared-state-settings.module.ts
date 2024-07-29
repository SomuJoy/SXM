import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SettingsEffects } from './state/effects';
import { appSettingsFeatureKey, getAppSettingsReducer } from './state/reducers';

@NgModule({
    imports: [CommonModule, SharedStateFeatureFlagsModule, StoreModule.forFeature(appSettingsFeatureKey, getAppSettingsReducer), EffectsModule.forFeature([SettingsEffects])],
    exports: [SharedStateFeatureFlagsModule]
})
export class SharedStateSettingsModule {}
