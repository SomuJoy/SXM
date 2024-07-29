import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedeemAndLinkWithAmazonComponent } from './redeem-and-link-with-amazon/redeem-and-link-with-amazon.component';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { RedemptionStatusComponent } from './redemption-status/redemption-status.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDealAddonCardModule],
    declarations: [RedeemAndLinkWithAmazonComponent, RedemptionStatusComponent],
    exports: [RedeemAndLinkWithAmazonComponent],
})
export class DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
