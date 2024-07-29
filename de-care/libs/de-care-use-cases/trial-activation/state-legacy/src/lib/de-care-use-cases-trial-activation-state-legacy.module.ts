import { NgModule } from '@angular/core';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [DomainsOffersStatePackageDescriptionsModule, DomainsOffersStateOffersWithCmsModule, DomainsCustomerStateLocaleModule],
})
export class DeCareUseCasesTrialActivationStateLegacyModule {}
