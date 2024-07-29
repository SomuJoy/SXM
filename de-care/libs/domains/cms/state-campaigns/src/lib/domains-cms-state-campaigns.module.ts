import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { featureKey, reducer } from './state/reducer';
import { Effects } from './state/effects';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([Effects])],
})
export class DomainsCmsStateCampaignsModule {}
