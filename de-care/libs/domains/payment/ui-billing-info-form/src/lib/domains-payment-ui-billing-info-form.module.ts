import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// TODO: Remove dependency on customer info module. We should be able to approximately use this module as customerInfoModule at some point.
import { CustomerInfoModule } from '@de-care/customer-info';

import { BillingInfoFormComponent } from './billing-info-form/billing-info-form.component';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiModule } from '@de-care/sxm-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { ReviewOrderModule } from '@de-care/review-order';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';

@NgModule({
    declarations: [BillingInfoFormComponent],
    exports: [BillingInfoFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CustomerInfoModule,
        TranslateModule.forChild(),
        SxmUiModule,
        SharedSxmUiUiAddressFormFieldsModule,
        ReviewOrderModule,
        DomainsPaymentUiPrepaidRedeemModule,
    ],
})
export class DomainsPaymentUiBillingInfoFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
