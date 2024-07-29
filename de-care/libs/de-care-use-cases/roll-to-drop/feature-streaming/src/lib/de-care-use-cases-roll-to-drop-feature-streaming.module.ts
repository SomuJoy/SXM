import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DeCareUseCasesRollToDropStateStreamingModule } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { CommonModule } from '@angular/common';
import { SubscribePageComponent } from './pages/subscribe-page/subscribe-page.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { OffersModule } from '@de-care/offers';
import { SalesCommonModule } from '@de-care/sales-common';
import { IdentificationModule } from '@de-care/identification';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPageCanActivateService } from './confirmation-page-can-activate.service';
import { ReviewOrderModule } from '@de-care/review-order';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { RollToDropFeatureStreamingGuard } from './roll-to-drop-feature-streaming.guard';
import { SharedSxmUiUiSxmInCarPlusStreamingModule } from '@de-care/shared/sxm-ui/ui-sxm-in-car-plus-streaming';
import { DomainsAccountStateSessionDataModule } from '@de-care/domains/account/state-session-data';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { DeCareUseCasesRollToDropUiSharedModule } from '@de-care/de-care-use-cases/roll-to-drop/ui-shared';
import { CheckFollowOnEligibleGuard } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';

@NgModule({
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                data: {
                    isStreaming: true,
                },
                component: SubscribePageComponent,
                canActivate: [RollToDropFeatureStreamingGuard, CheckFollowOnEligibleGuard],
            },
            {
                path: 'thanks',
                component: ConfirmationPageComponent,
                canActivate: [ConfirmationPageCanActivateService],
            },
        ]),
        DeCareUseCasesRollToDropStateStreamingModule,
        FeatureToggleModule,
        SxmUiModule,
        OffersModule,
        SalesCommonModule,
        IdentificationModule,
        DomainsQuotesUiOrderSummaryModule,
        FormsModule,
        ReactiveFormsModule,
        DomainsAccountUiRegisterModule,
        ReviewOrderModule,
        SharedSxmUiUiSxmInCarPlusStreamingModule,
        DomainsAccountStateSessionDataModule,
        SharedSxmUiUiHeroModule,
        SharedSxmUiUiLegalCopyModule,
        DeCareUseCasesRollToDropUiSharedModule,
        SharedSxmUiUiNucaptchaModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
    ],
    declarations: [SubscribePageComponent, ConfirmationPageComponent],
})
export class DeCareUseCasesRollToDropFeatureStreamingModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/feature-streaming.en-CA.json') },
            'en-US': { ...require('./i18n/feature-streaming.en-US.json') },
            'fr-CA': { ...require('./i18n/feature-streaming.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(true);
        }

        super(translateService, languages);
    }
}
