import { NgModule } from '@angular/core';
import { DomainsOffersStateUpsellsModule } from '@de-care/domains/offers/state-upsells';
import { DomainsOffersStateUpsellOffersInfoModule } from '@de-care/domains/offers/state-upsell-offers-info';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './state/effects';

@NgModule({
    imports: [EffectsModule.forFeature([Effects]), DomainsOffersStateUpsellsModule, DomainsOffersStateUpsellOffersInfoModule],
})
export class DomainsOffersStateUpsellsWithCmsModule {}
