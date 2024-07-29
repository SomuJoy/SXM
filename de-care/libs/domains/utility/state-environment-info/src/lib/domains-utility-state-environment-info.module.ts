import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { SessionIdEffect } from './state/session-id.effect';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([SessionIdEffect]), RouterModule]
})
export class DomainsUtilityStateEnvironmentInfoModule {}
