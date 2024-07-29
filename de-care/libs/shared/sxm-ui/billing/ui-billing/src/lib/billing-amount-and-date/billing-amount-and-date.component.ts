import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { BillingData } from '../interface';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-amount-and-date',
    templateUrl: './billing-amount-and-date.component.html',
    styleUrls: ['./billing-amount-and-date.component.scss'],
})
export class SxmUiBillingAmountAndDateComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: BillingData;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingAmountAndDateComponent],
    exports: [SxmUiBillingAmountAndDateComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDatePipeModule],
})
export class SharedSxmUiBillingBillingAmountAndDateModule {}
