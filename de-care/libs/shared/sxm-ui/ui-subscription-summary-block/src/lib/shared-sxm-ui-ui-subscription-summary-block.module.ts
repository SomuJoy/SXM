import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionSummaryBlockComponent } from './subscription-summary-block/subscription-summary-block.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SubscriptionSummaryBlockComponent],
    exports: [SubscriptionSummaryBlockComponent]
})
export class SharedSxmUiUiSubscriptionSummaryBlockModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
