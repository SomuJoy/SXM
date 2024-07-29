import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareUseCasesCheckoutStateUpgradeModule } from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TierUpConfirmationPageCanActivateService } from './pages/tier-up-confirmation-page/tier-up-confirmation-page-can-activate.service';
import { TierUpConfirmationPageComponent } from './pages/tier-up-confirmation-page/tier-up-confirmation-page.component';
import { TierUpPurchasePageCanActivateService } from './pages/tier-up-purchase-page/tier-up-purchase-page-can-activate.service';
import { TierUpPurchasePageComponent } from './pages/tier-up-purchase-page/tier-up-purchase-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { TierUpOfferComponent } from './page-parts/tier-up-offer/tier-up-offer.component';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import {
    LoadCardBinRangesAsyncCanActivateService,
    LoadEnvironmentInfoCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DefaultErrorPageComponent } from './pages/default-error-page/default-error-page.component';
import { ExpiredErrorPageComponent } from './pages/expired-error-page/expired-error-page.component';
import { RedeemedErrorPageComponent } from './pages/redeemed-error-page/redeemed-error-page.component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { CurrentChargesMessageComponent } from './current-charges-message/current-charges-message.component';
import { FullPricePurchasePageComponent } from './pages/full-price-purchase-page/full-price-purchase-page.component';
import { FullPricePurchasePageCanActivateService } from './pages/full-price-purchase-page/full-price-purchase-page-can-activate.service';
import { FullPriceConfirmationPageComponent } from './pages/full-price-confirmation-page/full-price-confirmation-page.component';
import { FullPriceConfirmationPageCanActivateService } from './pages/full-price-confirmation-page/full-price-confirmation-page-can-activate.service';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiFormsUiSelectPlanByTermFormModule } from '@de-care/shared-sxm-ui-forms-ui-select-plan-by-term-form';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { UpdatePriceAndTermPipe } from './pages/full-price-purchase-page/update-price-and-term.pipe';
import { AlreadyUpgradedErrorPageComponent } from './pages/already-upgraded-error-page/already-upgraded-error-page.component';
import { DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule } from '@de-care/domains/subscriptions/ui-redeem-and-link-with-amazon';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'fp/targeted',
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    LoadPackageDescriptionsCanActivateService,
                    UpdateUsecaseCanActivateService,
                    LoadEnvironmentInfoCanActivateService,
                ],
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration, useCaseKey: 'PKG_UPGRADE_FULL_PRICE' },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        canActivate: [LoadCardBinRangesAsyncCanActivateService, FullPricePurchasePageCanActivateService],
                        component: FullPricePurchasePageComponent,
                    },
                    {
                        path: 'thanks',
                        canActivate: [FullPriceConfirmationPageCanActivateService],
                        component: FullPriceConfirmationPageComponent,
                    },
                    {
                        path: 'already-upgraded-error',
                        component: AlreadyUpgradedErrorPageComponent,
                    },
                    {
                        path: 'default-error',
                        component: DefaultErrorPageComponent,
                    },
                ],
            },
            {
                path: 'tier-up/targeted',
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    LoadEnvironmentInfoCanActivateService,
                    LoadPackageDescriptionsCanActivateService,
                    UpdateUsecaseCanActivateService,
                ],
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration, useCaseKey: 'PKG_UPGRADE' },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        canActivate: [LoadCardBinRangesAsyncCanActivateService, TierUpPurchasePageCanActivateService],
                        component: TierUpPurchasePageComponent,
                    },
                    {
                        path: 'thanks',
                        canActivate: [TierUpConfirmationPageCanActivateService],
                        component: TierUpConfirmationPageComponent,
                        data: { animation: 'ConfirmationPage' },
                    },
                    {
                        path: 'default-error',
                        component: DefaultErrorPageComponent,
                    },
                    {
                        path: 'redeemed-error',
                        component: RedeemedErrorPageComponent,
                    },
                    {
                        path: 'expired-error',
                        component: ExpiredErrorPageComponent,
                    },
                    { path: 'error', component: DefaultErrorPageComponent },
                ],
            },
        ]),
        TranslateModule.forChild(),
        FormsModule,
        ReactiveComponentModule,
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesCheckoutStateUpgradeModule,
        DeCareUseCasesCheckoutUiCommonModule,
        ReactiveFormsModule,
        DomainsQuotesUiOrderSummaryModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiHeroModule,
        DomainsAccountUiRegisterModule,
        SharedSxmUiUiContentCardModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiStepperModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiSafeHtmlModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiFormsUiSelectPlanByTermFormModule,
        DomainsDeviceUiRefreshDeviceModule,
        SharedSxmUiUiProceedButtonModule,
        DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule,
    ],
    declarations: [
        TierUpPurchasePageComponent,
        TierUpConfirmationPageComponent,
        TierUpOfferComponent,
        DefaultErrorPageComponent,
        ExpiredErrorPageComponent,
        RedeemedErrorPageComponent,
        CurrentChargesMessageComponent,
        FullPricePurchasePageComponent,
        FullPriceConfirmationPageComponent,
        UpdatePriceAndTermPipe,
        AlreadyUpgradedErrorPageComponent,
    ],
    providers: [TierUpPurchasePageCanActivateService, TierUpConfirmationPageCanActivateService],
})
export class DeCareUseCasesCheckoutFeatureUpgradeModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
