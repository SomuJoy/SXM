import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { CustomerAccountsEffects } from './state/effects';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([CustomerAccountsEffects])]
})
export class DomainsAccountStateCustomerAccountsModule {}
