import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SxmUiModule } from '@de-care/sxm-ui';
import { CreditCardFormFieldsComponent } from './card-form-fields/credit-card-form-fields.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const DECLARATIONS = [CreditCardFormFieldsComponent];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, SxmUiModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsPurchaseUiCreditCardFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/domains-purchase-ui-credit-card-form-fields.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json')
            },
            'en-US': {
                ...require('./i18n/domains-purchase-ui-credit-card-form-fields.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json')
            },
            'fr-CA': {
                ...require('./i18n/domains-purchase-ui-credit-card-form-fields.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json')
            }
        };
        super(translateService, languages);
    }
}
