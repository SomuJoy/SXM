import { Effects } from './state/effects';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([Effects])],
})
export class DomainsAccountStateNextBestActionsModule {}
