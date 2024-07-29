import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { RadioNoMatchComponent } from './flepz/radio-no-match/radio-no-match.component';
import { FlepzFormComponent } from './flepz/flepz-form/flepz-form.component';
import { RadioLookupOptionsComponent } from './flepz/radio-lookup-options/radio-lookup-options.component';
import { LookupRadioIdComponent } from './radio/lookup-radio-id/lookup-radio-id.component';
import { LookupVinComponent } from './radio/lookup-vin/lookup-vin.component';
import { LookupLicensePlateComponent } from './radio/lookup-license-plate/lookup-license-plate.component';
import { ConfirmVinComponent } from './radio/confirm-vin/confirm-vin.component';
import { ActiveSubscriptionComponent } from './subscription/active-subscription/active-subscription.component';
import { ValidateUserRadioComponent } from './radio/validate-user-radio/validate-user-radio.component';
import { VinErrorComponent } from './radio/vin-error/vin-error.component';
import { VerifyDeviceTabsComponent } from './lookup/verify-device-tabs/verify-device-tabs.component';
import { YourInfoComponent } from './lookup/your-info/your-info.component';
import { DomainsAccountUiLoginModule } from '@de-care/domains/account/ui-login';
import { OffersModule } from '@de-care/offers';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { MarketingPromoCodeComponent } from './flepz/marketing-promo-code/marketing-promo-code.component';
import { AccountLookupComponent } from './lookup/account-lookup/account-lookup.component';
import { StreamingLoginCompleteComponent } from './streaming/streaming-login-complete/streaming-login-complete.component';
import { AccountIdInfoComponent } from './account-id/account-id-info/account-id-info.component';
import { YourSubscriptionsComponent } from './streaming/your-subscriptions/your-subscriptions.component';
import { SubscriptionItemComponent } from './streaming/your-subscriptions/subscription-item/subscription-item.component';
import { ValidateLpzFormComponent } from './lookup/validate-lpz-form/validate-lpz-form.component';
import { RflzFormComponent } from './rflz/rflz-form/rflz-form.component';
import { RflzErrorComponent } from './rflz/rflz-error/rflz-error.component';
import { AccountLookupFormComponent } from './account-lookup-form/account-lookup-form.component';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { DeviceLookupWizardComponent } from './device-lookup-wizard/device-lookup-wizard.component';
import { DomainsVehicleUiVehicleInfoModule } from '@de-care/domains/vehicle/ui-vehicle-info';
import { SharedSxmUiUiRadioidFormFieldModule } from '@de-care/shared/sxm-ui/ui-radioid-form-field';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiStreamingPlayerLinkModule } from '@de-care/shared/sxm-ui/ui-streaming-player-link';
import { SharedSxmUiUiTabsModule } from '@de-care/shared/sxm-ui/ui-tabs';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { SharedSxmUiUiNflOptInModule } from 'libs/shared/sxm-ui/ui-nfl-opt-in/src';
import { ForceUpdateFormFieldOnEnterKeyDirective } from '@de-care/shared/sxm-ui/ui-form-directives';
import { ZagFormComponent } from './zag/zag-form/zag-form.component';

const DECLARATIONS = [
    FlepzFormComponent,
    RadioNoMatchComponent,
    RadioLookupOptionsComponent,
    LookupRadioIdComponent,
    LookupVinComponent,
    LookupLicensePlateComponent,
    ConfirmVinComponent,
    ActiveSubscriptionComponent,
    ValidateUserRadioComponent,
    VinErrorComponent,
    VerifyDeviceTabsComponent,
    YourInfoComponent,
    MarketingPromoCodeComponent,
    AccountLookupComponent,
    StreamingLoginCompleteComponent,
    AccountIdInfoComponent,
    YourSubscriptionsComponent,
    SubscriptionItemComponent,
    ValidateLpzFormComponent,
    RflzFormComponent,
    RflzErrorComponent,
    AccountLookupFormComponent,
    DeviceLookupWizardComponent,
    ZagFormComponent,
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiModule,
        DomainsAccountUiLoginModule,
        OffersModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsVehicleUiVehicleInfoModule,
        SharedSxmUiUiRadioidFormFieldModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiStreamingPlayerLinkModule,
        SharedSxmUiUiTabsModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        SharedSxmUiUiNflOptInModule,
        ForceUpdateFormFieldOnEnterKeyDirective,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class IdentificationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/identification.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json'),
            },
            'en-US': {
                ...require('./i18n/identification.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json'),
            },
            'fr-CA': {
                ...require('./i18n/identification.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json'),
            },
        };
        super(translateService, languages);
        packageDescriptionTranslationService.loadTranslations(translateService);
    }
}
