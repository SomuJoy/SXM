import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsUtilityStateNativeAppIntegrationModule } from '@de-care/domains/utility/state-native-app-integration';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RflzWidgetComponent } from './rflz-widget/rflz-widget.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IdentificationModule } from '@de-care/identification';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ModuleWithTranslation } from '@de-care/app-common';
import { LANGUAGE_CODES, SettingsService, UserSettingsService } from '@de-care/settings';
import { FlepzWidgetComponent } from './flepz-widget/flepz-widget.component';
import { DomainsDataLayerStateTrackingModule } from '@de-care/domains/data-layer/state-tracking';
import { DomainsOffersUiPromoCodeValidationFormModule } from '@de-care/domains/offers/ui-promo-code-validation-form';
import { PromoCodeValidationComponent } from './promo-code-validation-widget/promo-code-validation-widget.component';
import { DomainsUtilityStateEnvironmentInfoModule, LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { DomainsIdentityUiStreamingFlepzLookupFormModule } from '@de-care/domains/identity/ui-streaming-flepz-lookup-form';
import { StreamingFlepzWidgetComponent } from './streaming-flepz-widget/streaming-flepz-widget.component';
import { DomainsDeviceStateDeviceInfoModule } from '@de-care/domains/device/state-device-info';
import { RflzWidgetLoaderComponent } from './rflz-widget-loader/rflz-widget-loader.component';
import { DomainsUtilityStateLogMessageModule } from '@de-care/domains/utility/state-log-message';
import { ZAGWidgetComponent } from './zag-widget/zag-widget.component';
import { DomainsOffersStatePackageDescriptionsModule, LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { StreamingPlayerLinkAnchorComponent } from '@de-care/domains/subscriptions/ui-player-app-integration';

const COMPONENTS = [ZAGWidgetComponent, RflzWidgetComponent, FlepzWidgetComponent, PromoCodeValidationComponent, StreamingFlepzWidgetComponent, RflzWidgetLoaderComponent];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        DomainsOffersStatePackageDescriptionsModule,
        DomainsDataLayerStateTrackingModule,
        DomainsUtilityStateLogMessageModule,
        TranslateModule.forChild(),
        IdentificationModule,
        StoreModule.forRoot([], {}),
        EffectsModule.forRoot([]),
        SxmUiModule,
        DomainsOffersUiPromoCodeValidationFormModule,
        DomainsUtilityStateEnvironmentInfoModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsIdentityUiStreamingFlepzLookupFormModule,
        SharedSxmUiUiPrivacyPolicyModule,
        DomainsUtilityStateNativeAppIntegrationModule,
        DomainsDeviceStateDeviceInfoModule,
        CommonModule,
        StreamingPlayerLinkAnchorComponent,
    ],
    exports: [...COMPONENTS, StreamingPlayerLinkAnchorComponent],
})
export class ElementsModule extends ModuleWithTranslation {
    constructor(
        translateService: TranslateService,
        settingsService: SettingsService,
        userSettingsService: UserSettingsService,
        loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService
    ) {
        super(translateService, {
            'en-CA': {
                ...require('./i18n/elements.en-CA.json'),
            },
            'en-US': {
                ...require('./i18n/elements.en-US.json'),
            },
            'fr-CA': {
                ...require('./i18n/elements.fr-CA.json'),
            },
        });
        translateService.setDefaultLang(LANGUAGE_CODES.DEFAULT.US);
        if (settingsService.isCanadaMode) {
            if (userSettingsService.isQuebec()) {
                translateService.use(LANGUAGE_CODES.FR_CA);
            } else {
                translateService.use(LANGUAGE_CODES.EN_CA);
            }
        } else {
            translateService.use(LANGUAGE_CODES.DEFAULT.US);
        }
        loadEnvironmentInfoWorkflowService.build().subscribe();
        loadAllPackageDescriptionsWorkflowService.build().subscribe();
    }
}
