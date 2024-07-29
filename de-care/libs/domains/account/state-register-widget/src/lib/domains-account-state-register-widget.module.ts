import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { VerifyOptionsEffect } from './state/effects/verify-options.effect';
import { featureKey, reducer } from './state/reducer/reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([VerifyOptionsEffect])]
})
export class DomainsAccountStateRegisterWidgetModule {}
