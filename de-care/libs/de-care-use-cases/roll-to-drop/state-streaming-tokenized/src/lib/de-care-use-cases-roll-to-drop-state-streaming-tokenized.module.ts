import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeCareUseCasesRollToDropStateSharedModule } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [CommonModule, DeCareUseCasesRollToDropStateSharedModule, StoreModule.forFeature(featureKey, reducer)]
})
export class DeCareUseCasesRollToDropStateStreamingTokenizedModule {}
