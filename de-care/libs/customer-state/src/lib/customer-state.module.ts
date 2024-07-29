import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { customerReducer, customerFeatureKey } from './state/customer.reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(customerFeatureKey, customerReducer), EffectsModule.forFeature([])]
})
export class CustomerStateModule {}
