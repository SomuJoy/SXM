import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FeatureFlagEffects } from './state/effects';
import { featureFlagFeatureKey, reducer } from './state/reducer';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { AdobeEffects } from './state/adobe.effects';

@NgModule({
    imports: [CommonModule, FeatureToggleModule, StoreModule.forFeature(featureFlagFeatureKey, reducer), EffectsModule.forFeature([FeatureFlagEffects, AdobeEffects])],
    exports: [FeatureToggleModule]
})
export class SharedStateFeatureFlagsModule {}
