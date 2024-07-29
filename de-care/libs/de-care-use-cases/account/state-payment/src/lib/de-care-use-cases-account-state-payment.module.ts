import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateNextBestActionsModule } from '@de-care/domains/account/state-next-best-actions';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [
        DomainsAccountStateAccountModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateNextBestActionsModule,
    ],
})
export class DeCareUseCasesAccountStatePaymentModule {}
