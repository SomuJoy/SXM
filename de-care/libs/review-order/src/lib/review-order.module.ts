import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChargeAgreementComponent } from './charge-agreement/charge-agreement.component';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ChargeAgreementWithValidationComponent } from './charge-agreement-with-validation/charge-agreement-with-validation.component';

const DECLARATIONS = [ChargeAgreementComponent, ChargeAgreementWithValidationComponent];

@NgModule({
    imports: [FormsModule, CommonModule, HttpClientModule, SxmUiModule, TranslateModule.forChild()],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class ReviewOrderModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/review-order.en-CA.json'),
            'en-US': require('./i18n/review-order.en-US.json'),
            'fr-CA': require('./i18n/review-order.fr-CA.json')
        };
        super(translateService, languages);
    }
}
