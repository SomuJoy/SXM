import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiCreditCardFormFieldsComponent } from './credit-card-form-fields/credit-card-form-fields.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SxmUiChargeAgreementCheckboxFormFieldComponent } from './charge-agreement-checkbox-form-field/charge-agreement-checkbox-form-field.component';
import { SxmUiCreditCardNumberFormFieldComponent } from './credit-card-number-form-field/credit-card-number-form-field.component';
import { SxmUiExpirationDateFormFieldComponent } from './expiration-date-form-field/expiration-date-form-field.component';
import { SxmUiCvvFormFieldComponent } from './cvv-form-field/cvv-form-field.component';
import { SxmUiMaskExpirationDateDirective } from './mask-expiration-date.directive';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SxmUiNameOnCardFormFieldComponent } from './name-on-card-form-field/name-on-card-form-field.component';
import { CreditCardTypeDirective } from './credit-card-type.directive';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SxmUiMaskCreditCardDirective } from './mask-credit-card.directive';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SxmUiInvoiceAgreementCheckboxFormFieldComponent } from './invoice-agreement-checkbox-form-field/invoice-agreement-checkbox-form-field.component';
import { SharedSxmUiUiIconCcAmexModule } from '@de-care/shared/sxm-ui/ui-icon-cc-amex';
import { SharedSxmUiUiIconCcVisaModule } from '@de-care/shared/sxm-ui/ui-icon-cc-visa';
import { SharedSxmUiUiIconLockModule } from '@de-care/shared/sxm-ui/ui-icon-lock';
import { SharedSxmUiUiIconCcDciModule } from '@de-care/shared/sxm-ui/ui-icon-cc-dci';
import { SharedSxmUiUiIconCcDiscoverModule } from '@de-care/shared/sxm-ui/ui-icon-cc-discover';
import { SharedSxmUiUiIconCcJcbModule } from '@de-care/shared/sxm-ui/ui-icon-cc-jcb';
import { SharedSxmUiUiIconCcMcModule } from '@de-care/shared/sxm-ui/ui-icon-cc-mc';
import { SharedSxmUiUiIconCcUnionpayModule } from '@de-care/shared/sxm-ui/ui-icon-cc-unionpay';

const DECLARATIONS = [
    SxmUiCreditCardFormFieldsComponent,
    SxmUiChargeAgreementCheckboxFormFieldComponent,
    SxmUiNameOnCardFormFieldComponent,
    SxmUiCreditCardNumberFormFieldComponent,
    SxmUiExpirationDateFormFieldComponent,
    SxmUiCvvFormFieldComponent,
    SxmUiInvoiceAgreementCheckboxFormFieldComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiIconCcAmexModule,
        SharedSxmUiUiIconCcDciModule,
        SharedSxmUiUiIconCcDiscoverModule,
        SharedSxmUiUiIconCcJcbModule,
        SharedSxmUiUiIconCcMcModule,
        SharedSxmUiUiIconCcUnionpayModule,
        SharedSxmUiUiIconCcVisaModule,
        SharedSxmUiUiIconLockModule,
    ],
    declarations: [...DECLARATIONS, SxmUiMaskExpirationDateDirective, SxmUiMaskCreditCardDirective, CreditCardTypeDirective],
    exports: [...DECLARATIONS],
})
export class SharedSxmUiUiCreditCardFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
        // Add Spanish translations
        if (!translateService.langs.includes('es-US')) {
            translateService.addLangs(['es-US']);
        }
        const t = require('./i18n/module.es-US.json');
        translateService.setTranslation('es-US', t, true);
    }
}
