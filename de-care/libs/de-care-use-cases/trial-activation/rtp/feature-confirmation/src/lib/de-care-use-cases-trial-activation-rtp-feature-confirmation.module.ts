import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SharedSxmUiUiReadyToExploreWrapperModule } from '@de-care/shared/sxm-ui/ui-ready-to-explore-wrapper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { SharedSxmUiUiGlobalPersonalInfoModule } from '@de-care/shared/sxm-ui/ui-global-personal-info';
import { SharedSxmUiUiImportantInfoWrapperModule } from '@de-care/shared/sxm-ui/ui-important-info-wrapper';
import { ReviewCompletedGuard } from './review-completed.guard';
import { DeCareUseCasesTrialActivationRtpStateSharedModule } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { SecurityQuestionsGuard } from './security-questions.guard';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { DeCareUseCasesTrialActivationRtpStateConfirmationModule } from '@de-care/de-care-use-cases/trial-activation/rtp/state-confirmation';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';

@NgModule({
    imports: [
        CommonModule,
        SharedSxmUiUiReadyToExploreWrapperModule,
        TranslateModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiImportantInfoWrapperModule,
        SharedSxmUiUiGlobalPersonalInfoModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsQuotesUiOrderSummaryModule,
        DomainsAccountUiRegisterModule,
        SharedStateFeatureFlagsModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: ConfirmationComponent,
                canActivate: [ReviewCompletedGuard, SecurityQuestionsGuard],
            },
        ]),
        DeCareUseCasesTrialActivationRtpStateSharedModule,
        DomainsAccountStateSecurityQuestionsModule,
        DeCareUseCasesTrialActivationRtpStateConfirmationModule,
        DomainsAccountStateAccountModule,
    ],
    declarations: [ConfirmationComponent],
})
export class DeCareUseCasesTrialActivationRtpFeatureConfirmationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
