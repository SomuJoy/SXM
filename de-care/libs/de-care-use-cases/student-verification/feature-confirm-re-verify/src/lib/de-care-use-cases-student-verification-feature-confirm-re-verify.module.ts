import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesStudentVerificationStateConfirmReVerifyModule } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { RollOverCompleteGuard } from './roll-over-complete-guard.service';
import { RollOverCompleteComponent } from '../../../feature-confirm-re-verify/src/lib/pages/roll-over-complete/roll-over-complete.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActiveSubscriptionGuard } from './active-subscription-guard.service';
import { ConfirmReVerifyFlowGuardService } from './confirm-re-verify-flow-guard.service';
import { ErrorPageResolverService } from './error-page-resolver.service';
import { ActiveSubscriptionPageComponent } from './pages/active-subscription-page/active-subscription-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { OfferToOfferConfirmationComponent } from './pages/offer-to-offer-confirmation-page/offer-to-offer-confirmation-page.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
// TODO: Need to be refactored
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { LoadEnvironmentInfoCanActivateService, LoadPackageDescriptionsCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { RollOverCompletePersonalInfoComponent } from './page-parts/roll-over-complete-personal-info/roll-over-complete-personal-info.component';

// TODO: Need to be refactored
import { SxmUiModule } from '@de-care/sxm-ui';

@NgModule({
    imports: [
        CommonModule,
        DeCareUseCasesStudentVerificationStateConfirmReVerifyModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [LoadPackageDescriptionsCanActivateService, LoadEnvironmentInfoCanActivateService],
                data: { useCaseKey: 'PKG_UPGRADE_FULL_PRICE' },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        canActivate: [ConfirmReVerifyFlowGuardService],
                    },
                    {
                        path: 'error',
                        component: ErrorPageComponent,
                        resolve: {
                            errorPage: ErrorPageResolverService,
                        },
                    },
                    {
                        path: 'active-subscription',
                        component: ActiveSubscriptionPageComponent,
                        canActivate: [ActiveSubscriptionGuard, LoadPackageDescriptionsCanActivateService],
                    },
                    {
                        path: 'roll-over-complete',
                        component: RollOverCompleteComponent,
                        canActivate: [RollOverCompleteGuard, LoadPackageDescriptionsCanActivateService],
                    },
                    {
                        path: 'complete',
                        component: OfferToOfferConfirmationComponent,
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        DomainsQuotesUiOrderSummaryModule,
        TranslateModule.forChild(),
        FeatureToggleModule,
        DomainsAccountUiRegisterModule,
        SharedSxmUiUiHeroModule,
        SxmUiModule,
    ],
    declarations: [ErrorPageComponent, ActiveSubscriptionPageComponent, OfferToOfferConfirmationComponent, RollOverCompleteComponent, RollOverCompletePersonalInfoComponent],
})
export class DeCareUseCasesStudentVerificationFeatureConfirmReVerifyModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/feature-confirm-reverify.en-CA.json'),
            'en-US': require('./i18n/feature-confirm-reverify.en-US.json'),
            'fr-CA': require('./i18n/feature-confirm-reverify.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
