import { NgModule } from '@angular/core';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { DomainsUtilityStateUpdateUsecaseModule } from '@de-care/domains/utility/state-update-usecase';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';

@NgModule({
    imports: [DomainsUtilityStateEnvironmentInfoModule, DomainsUtilityStateUpdateUsecaseModule, DomainsOffersStateOffersModule],
})
export class DeCareUseCasesCheckoutStateStreamingSelfPayOrganicModule {}
