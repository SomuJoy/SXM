import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getDeviceInfoReducer, featureKey } from './state/reducer';
import { DeviceInfoEffects } from './state/device-info.effect';

@NgModule({
    imports: [CommonModule, HttpClientModule, StoreModule.forFeature(featureKey, getDeviceInfoReducer), EffectsModule.forFeature([DeviceInfoEffects])]
})
export class DomainsDeviceStateDeviceInfoModule {}
