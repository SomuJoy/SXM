import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { featureKey, reducer } from './state/reducers/reducer';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(featureKey, reducer), DomainsOffersStateOffersWithCmsModule]
})
export class DeCareUseCasesStudentVerificationStateReVerificationModule {}
