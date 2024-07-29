import { SxmUiModule } from '@de-care/sxm-ui';
import { PrepaidRedeemComponent } from './prepaid-redeem/prepaid-redeem.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const DECLARATIONS = [PrepaidRedeemComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, SxmUiModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsPaymentUiPrepaidRedeemModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/domains-payment-ui-prepaid-redeem.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json')
            },
            'en-US': {
                ...require('./i18n/domains-payment-ui-prepaid-redeem.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json')
            },
            'fr-CA': {
                ...require('./i18n/domains-payment-ui-prepaid-redeem.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json')
            }
        };
        super(translateService, languages);
    }
}
