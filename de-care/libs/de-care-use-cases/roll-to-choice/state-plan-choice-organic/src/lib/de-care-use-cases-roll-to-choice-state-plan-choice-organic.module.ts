import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [CommonModule, DomainsOffersStateOffersModule, StoreModule.forFeature(featureKey, reducer)]
})
export class DeCareUseCasesRollToChoiceStatePlanChoiceOrganicModule {}
