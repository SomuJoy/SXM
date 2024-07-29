import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsDeviceStateDeviceInfoModule } from '@de-care/domains/device/state-device-info';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DomainsQuotesStateQuoteModule,
        DomainsDeviceStateDeviceInfoModule,
        DomainsOffersStatePackageDescriptionsModule,
    ],
})
export class DeCareUseCasesTransferStateACSCTargetedModule {}
