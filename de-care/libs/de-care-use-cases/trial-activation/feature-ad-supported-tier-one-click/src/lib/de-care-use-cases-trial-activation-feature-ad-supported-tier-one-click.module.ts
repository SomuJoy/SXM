import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesTrialActivationStateAdSupportedTierOneClickModule } from '@de-care/de-care-use-cases/trial-activation/state-ad-supported-tier-one-click';
import { AdSupportedTierOneTokenCanActivateService } from './ad-supported-tier-one-token-can-activate.service';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { AdSupportedTierOneClickConfirmationCanActivateService } from './ad-supported-tier-one-click-confirmation-can-activate.service';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { AlreadyHasSubscriptionErrorPageComponent } from './pages/already-has-subscription-error-page/already-has-subscription-error-page.component';
import { IsNotEligibleErrorPageComponent } from './pages/is-not-eligible-error-page/is-not-eligible-error-page.component';
import { DefaultErrorPageComponent } from './pages/default-error-page/default-error-page.component';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                canActivate: [AdSupportedTierOneTokenCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: 'ast-activated',
                canActivate: [AdSupportedTierOneClickConfirmationCanActivateService],
                component: ConfirmationPageComponent,
            },
            {
                path: 'cant-be-completed-online-error',
                component: DefaultErrorPageComponent,
            },
            {
                path: 'already-active-selfpay-error',
                component: AlreadyHasSubscriptionErrorPageComponent,
            },
            {
                path: 'not-eligible-error',
                component: IsNotEligibleErrorPageComponent,
            },
        ]),
        DeCareUseCasesTrialActivationStateAdSupportedTierOneClickModule,
        DomainsOffersUiHeroModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    providers: [AdSupportedTierOneTokenCanActivateService, AdSupportedTierOneClickConfirmationCanActivateService],
    declarations: [ConfirmationPageComponent, AlreadyHasSubscriptionErrorPageComponent, IsNotEligibleErrorPageComponent, DefaultErrorPageComponent],
})
export class DeCareUseCasesTrialActivationFeatureAdSupportedTierOneClickModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
