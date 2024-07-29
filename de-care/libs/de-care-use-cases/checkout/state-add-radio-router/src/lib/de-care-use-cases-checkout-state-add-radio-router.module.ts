import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsIdentityStateFlepzLookupModule } from '@de-care/domains/identity/state-flepz-lookup';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './state/effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsIdentityStateFlepzLookupModule,
        DomainsAccountStateAccountModule,
    ],
})
export class DeCareUseCasesCheckoutStateAddRadioRouterModule {}
