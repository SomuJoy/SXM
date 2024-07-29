import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DeCareUseCasesTrialActivationRtpStateCreateAccountModule } from '@de-care/de-care-use-cases/trial-activation/rtp/state-create-account';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { ReviewOrderModule } from '@de-care/review-order';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateAccountCompletedGuard } from './create-account-completed.guard';
import { QuoteInformationGuard } from './quote-information.guard';
import { ReviewComponent } from './review/review.component';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { FormsModule } from '@angular/forms';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ReviewComponent,
                canActivate: [CreateAccountCompletedGuard, QuoteInformationGuard]
            }
        ]),
        DeCareUseCasesSharedUiPageMainModule,
        ReviewOrderModule,
        DomainsQuotesUiOrderSummaryModule,
        DeCareUseCasesTrialActivationRtpStateCreateAccountModule,
        DomainsQuotesUiOrderSummaryModule,
        SharedStateFeatureFlagsModule,
        SharedSxmUiUiProceedButtonModule,
        SxmUiModule,
        SharedSxmUiUiNucaptchaModule,
        FormsModule,
        SharedSxmUiUiLegalCopyModule
    ],
    declarations: [ReviewComponent]
})
export class DeCareUseCasesTrialActivationRtpFeatureReviewModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
