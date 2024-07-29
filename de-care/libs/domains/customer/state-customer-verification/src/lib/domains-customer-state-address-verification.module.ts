import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { reducer, REDUCER_KEY } from './state/reducer';

@NgModule({
    imports: [CommonModule, SharedStateSettingsModule, StoreModule.forFeature(REDUCER_KEY, reducer)]
})
export class DomainsCustomerStateAddressVerificationModule {}
