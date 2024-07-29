import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiBillingBillingAmountAndDateForTrialerModule } from '../billing-amount-and-date-for-trialer/billing-amount-and-date-for-trialer.component';
import { SharedSxmUiBillingBillingHeaderModule } from '../billing-header/billing-header.component';
import { BillingData } from '../interface';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-with-trialer-no-payment-due',
    templateUrl: './billing-with-trialer-no-payment-due.component.html',
    styleUrls: ['./billing-with-trialer-no-payment-due.component.scss'],
})
export class SxmUiBillingWithTrialerNoPaymentDueComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: BillingData;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingWithTrialerNoPaymentDueComponent],
    exports: [SxmUiBillingWithTrialerNoPaymentDueComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiBillingBillingHeaderModule, SharedSxmUiBillingBillingAmountAndDateForTrialerModule],
})
export class SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule {}
