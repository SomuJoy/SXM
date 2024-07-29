import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DomainsAccountStateBrandedDataCollectionModule } from '@de-care/domains/account/state-branded-data-collection';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), DomainsAccountStateBrandedDataCollectionModule],
})
export class DeCareUseCasesAccountStateInfoCustomerCollectionModule {}
