import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { ProvinceEffect } from './state/effects/province.effect';
import { EffectsModule } from '@ngrx/effects';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureKey, rtdTrialActivationReducer } from './state/reducer';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DeCareUseCasesRollToDropStateSharedModule } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { DomainsUtilityStateUpdateUsecaseModule } from '@de-care/domains/utility/state-update-usecase';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(featureKey, rtdTrialActivationReducer),
        EffectsModule.forFeature([ProvinceEffect]),
        DomainsOffersStateOffersWithCmsModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateAccountModule,
        DomainsAccountStateSecurityQuestionsModule,
        DeCareUseCasesRollToDropStateSharedModule,
        DomainsUtilityStateUpdateUsecaseModule,
    ],
})
export class DeCareUseCasesRollToDropStateStreamingModule {}
