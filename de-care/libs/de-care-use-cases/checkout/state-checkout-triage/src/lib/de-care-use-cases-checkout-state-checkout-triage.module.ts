import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CheckoutTriageOffersEffects } from './state/checkout-triage-offers.effects';
import { featureKey, checkoutTriageReducer } from './state/checkout-triage.reducers';
import { CheckoutTriageEffects } from './state/checkout-triage.effects';
import { ClearApplicationStatesEffects } from './state/clear-application-states.effects';
import { CmsTriageUpsellSelectionEffects } from './state/cms-triage-upsell-selection.effects';
import { FormatAndSetLangEffects } from './state/format-and-set-lang.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, checkoutTriageReducer),
        EffectsModule.forFeature([CheckoutTriageEffects, CheckoutTriageOffersEffects, CmsTriageUpsellSelectionEffects, FormatAndSetLangEffects, ClearApplicationStatesEffects])
    ]
})
export class DeCareUseCasesCheckoutStateCheckoutTriageModule {}
