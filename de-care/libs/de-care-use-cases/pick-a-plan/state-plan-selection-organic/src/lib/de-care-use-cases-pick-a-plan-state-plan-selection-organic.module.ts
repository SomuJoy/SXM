import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        CommonModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DomainsOffersStatePackageDescriptionsModule,
        StoreModule.forFeature(featureKey, reducer),
    ],
})
export class DeCareUseCasesPickAPlanStatePlanSelectionOrganicModule {}
