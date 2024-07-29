import { NgModule } from '@angular/core';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';

@NgModule({
    imports: [DomainsOffersStateOffersWithCmsModule, DomainsCustomerStateLocaleModule]
})
export class DeCareUseCasesStudentVerificationStateCommonModule {}
