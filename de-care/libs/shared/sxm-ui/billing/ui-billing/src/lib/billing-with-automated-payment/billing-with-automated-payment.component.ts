import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { BillingData } from '../interface';
import { SharedSxmUiBillingBillingAmountAndDateModule } from '../billing-amount-and-date/billing-amount-and-date.component';
import { SharedSxmUiBillingBillingFooterModule } from '../billing-footer/billing-footer.component';
import { SharedSxmUiBillingBillingHeaderModule } from '../billing-header/billing-header.component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-with-automated-payment',
    templateUrl: './billing-with-automated-payment.component.html',
    styleUrls: ['./billing-with-automated-payment.component.scss'],
})
export class SxmUiBillingWithAutomatedPaymentComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: BillingData;
    @Input() showWarning = false;
    @Input() allowPaymentUpdate = false;

    @Output() makePayment = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingWithAutomatedPaymentComponent],
    exports: [SxmUiBillingWithAutomatedPaymentComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiBillingBillingHeaderModule,
        SharedSxmUiBillingBillingAmountAndDateModule,
        SharedSxmUiBillingBillingFooterModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
})
export class SharedSxmUiBillingBillingWithAutomatedPaymentModule {}
