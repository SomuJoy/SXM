import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, getCredentialsRecoveryReducer } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, getCredentialsRecoveryReducer)],
})
export class DomainsIdentityStateCredentialsRecoveryModule {}
