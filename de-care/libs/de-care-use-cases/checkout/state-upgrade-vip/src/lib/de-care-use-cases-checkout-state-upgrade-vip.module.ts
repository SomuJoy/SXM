import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { LoadCheckoutDataWorkflowService } from './workflows/load-checkout-data-workflow.service';
import { LoadReviewDataWorkflowService } from './workflows/load-review-data-workflow.service';
import { ProcessCompleteOrderStatusWorkflowService } from './workflows/process-complete-order-status-workflow.service';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { LoadOrganicDataWorkflowService } from './workflows/load-organic-data-workflow.service';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DomainsOffersStateOffersModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsOffersStatePackageDescriptionsModule,
    ],
    providers: [LoadCheckoutDataWorkflowService, LoadReviewDataWorkflowService, ProcessCompleteOrderStatusWorkflowService, LoadOrganicDataWorkflowService],
})
export class DeCareUseCasesCheckoutStateUpgradeVipModule {}
