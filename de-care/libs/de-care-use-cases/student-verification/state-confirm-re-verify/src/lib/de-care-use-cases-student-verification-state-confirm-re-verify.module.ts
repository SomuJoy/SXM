import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { StateConfirmReverifyEffects } from './state/effects';

@NgModule({
    imports: [
        CommonModule,
        DomainsOffersStateOffersModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([StateConfirmReverifyEffects])
    ]
})
export class DeCareUseCasesStudentVerificationStateConfirmReVerifyModule {}
