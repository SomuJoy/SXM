import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { reducer, featureKey } from './state/reducer';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DomainsOffersStateOffersWithCmsModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsAccountStateAccountModule,
    ],
})
export class DeCareUseCasesCheckoutStateZeroCostModule {}
