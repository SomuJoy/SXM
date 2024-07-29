import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountAndSubscriptionsInfoComponent } from './account-and-subscriptions-info/account-and-subscriptions-info.component';
import { SharedSxmUiUiConcatElementsPipeModule } from '@de-care/shared/sxm-ui/ui-concat-elements-pipe';
@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiConcatElementsPipeModule],
    declarations: [AccountAndSubscriptionsInfoComponent],
    exports: [AccountAndSubscriptionsInfoComponent]
})
export class DomainsAccountUiAccountAndSubscriptionsInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
