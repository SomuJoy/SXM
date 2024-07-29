import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DeCareUseCasesRollToDropStateStreamingTokenizedModule } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming-tokenized';
import { OffersModule } from '@de-care/offers';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SharedSxmUiUiSxmInCarPlusStreamingModule } from '@de-care/shared/sxm-ui/ui-sxm-in-car-plus-streaming';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { ReviewOrderModule } from '@de-care/review-order';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SalesCommonModule } from '@de-care/sales-common';
import { DeCareUseCasesRollToDropUiSharedModule } from '@de-care/de-care-use-cases/roll-to-drop/ui-shared';
import { SubscribePageComponent } from './pages/subscribe-page/subscribe-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { RollToDropFeatureStreamingTokenizedGuard } from './roll-to-drop-feature-streaming-tokenized.guard';
import { CheckFollowOnEligibleGuard } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { ConfirmationPageCanActivateService } from './confirmation-page-can-activate.service';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { SharedSxmUiUiMaskEmailPipeModule } from '@de-care/shared/sxm-ui/ui-mask-email-pipe';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                data: {
                    isStreaming: true,
                },
                component: SubscribePageComponent,
                canActivate: [RollToDropFeatureStreamingTokenizedGuard, CheckFollowOnEligibleGuard],
            },
            {
                path: 'thanks',
                component: ConfirmationPageComponent,
                canActivate: [ConfirmationPageCanActivateService],
            },
        ]),
        DeCareUseCasesRollToDropStateStreamingTokenizedModule,
        FormsModule,
        ReactiveFormsModule,
        OffersModule,
        SharedSxmUiUiSxmInCarPlusStreamingModule,
        SxmUiModule,
        DomainsQuotesUiOrderSummaryModule,
        FeatureToggleModule,
        ReviewOrderModule,
        SharedSxmUiUiLegalCopyModule,
        SharedSxmUiUiHeroModule,
        SalesCommonModule,
        DeCareUseCasesRollToDropUiSharedModule,
        DeCareUseCasesRollToDropStateStreamingTokenizedModule,
        SharedSxmUiUiPasswordFormFieldModule,
        DomainsAccountUiRegisterModule,
        SharedSxmUiUiMaskEmailPipeModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
    ],
    declarations: [SubscribePageComponent, ConfirmationPageComponent],
})
export class DeCareUseCasesRollToDropFeatureStreamingTokenizedModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(true);
        }

        super(translateService, languages);
    }
}
