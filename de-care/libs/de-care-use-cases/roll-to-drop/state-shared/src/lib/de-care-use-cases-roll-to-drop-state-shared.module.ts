import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(featureKey, reducer)]
})
export class DeCareUseCasesRollToDropStateSharedModule {}
