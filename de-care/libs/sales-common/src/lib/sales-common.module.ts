import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule, WithoutPlatformNamePipe, WithoutPlatformNameWithArticlePipe, WithoutPlatformNameStreamingPipe } from '@de-care/sxm-ui';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PromoDealComponent } from './promo-deal/promo-deal.component';
import { PromoDealCardComponent } from './promo-deal-card/promo-deal-card.component';
import { ClaimDeviceComponent } from './claim-device/claim-device.component';
import { AmazonLoginComponent } from './amazon-login/amazon-login.component';
import { OfferDetailsTranslateService } from './offer-details-translate.service';

const DECLARATIONS = [OfferDetailsComponent, PersonalInfoComponent, PromoDealComponent, PromoDealCardComponent, ClaimDeviceComponent, AmazonLoginComponent];
import { DomainsOffersUiGetDiffExcludedChannelsPipeModule } from '@de-care/domains/offers/ui-get-diff-excluded-channels-pipe';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule, DomainsOffersUiGetDiffExcludedChannelsPipeModule],
    declarations: [...DECLARATIONS],
    providers: [OfferDetailsTranslateService, CurrencyPipe, WithoutPlatformNamePipe, WithoutPlatformNameWithArticlePipe, WithoutPlatformNameStreamingPipe, I18nPluralPipe],
    exports: [...DECLARATIONS]
})
export class SalesCommonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/sales-common.en-CA.json'),
            'en-US': require('./i18n/sales-common.en-US.json'),
            'fr-CA': require('./i18n/sales-common.fr-CA.json')
        };
        super(translateService, languages);
    }
}
