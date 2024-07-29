import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { SharedSxmUiUiDatePipeModule, SharedSxmUiCurrencyPipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DataModel {
    date: string;
    url: string;
    price: number;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-price-change-message',
    template: ` <p
        class="small-copy"
        [innerHTML]="translateKeyPrefix + '.MESSAGE' | translate: { date: data?.date | sxmUiDate: 'longDate', url: data?.url, price: data?.price | sxmUiCurrency: null:true }"
    ></p>`,
    styleUrls: ['./price-change-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPriceChangeMessageComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() data: DataModel;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiPriceChangeMessageComponent],
    exports: [SxmUiPriceChangeMessageComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDatePipeModule, SharedSxmUiCurrencyPipeModule],
})
export class SxmUiPriceChangeMessageComponentModule {}
