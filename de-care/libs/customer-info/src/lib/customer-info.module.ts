import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { YourDeviceInfoComponent } from './your-device-info/your-device-info.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { VerifyAddressComponent } from './verify-address/verify-address.component';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiPostalCodeFormWrapperModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-wrapper';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { InvalidAddressMessageComponent } from './invalid-address-message/invalid-address-message.component';
import { PaymentInfoStreamingOrganicComponent } from './payment-info-streaming-organic/payment-info-streaming-organic.component';
import { PaymentInfoWithInvoiceComponent } from './payment-info-with-invoice/payment-info-with-invoice.component';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';

const DECLARATIONS = [
    YourDeviceInfoComponent,
    PaymentInfoComponent,
    VerifyAddressComponent,
    InvalidAddressMessageComponent,
    PaymentInfoStreamingOrganicComponent,
    PaymentInfoWithInvoiceComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPostalCodeFormWrapperModule,
        DomainsPaymentUiPrepaidRedeemModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS, SharedSxmUiUiAddressFormFieldsModule],
})
export class CustomerInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/customer-info.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json'),
            },
            'en-US': {
                ...require('./i18n/customer-info.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json'),
            },
            'fr-CA': {
                ...require('./i18n/customer-info.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json'),
            },
        };
        super(translateService, languages);
    }
}
