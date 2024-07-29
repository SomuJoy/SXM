import { NgModule } from '@angular/core';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsCustomerStateLocaleModule,
        DomainsOffersStatePackageDescriptionsModule,
    ],
    declarations: [],
})
export class DeCareUseCasesCheckoutStateStudentVerificationModule {}
