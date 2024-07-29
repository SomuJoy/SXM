import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiBillingBillingHeaderModule } from '../billing-header/billing-header.component';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-with-no-payment-due-automated',
    templateUrl: './billing-with-no-payment-due-automated.component.html',
    styleUrls: ['./billing-with-no-payment-due-automated.component.scss'],
})
export class SxmUiBillingWithNoPaymentDueAutomatedComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: { date: 'string' };

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingWithNoPaymentDueAutomatedComponent],
    exports: [SxmUiBillingWithNoPaymentDueAutomatedComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiBillingBillingHeaderModule, SharedSxmUiUiDatePipeModule],
})
export class SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule {}
