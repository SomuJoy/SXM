import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-footer',
    templateUrl: './billing-footer.component.html',
    styleUrls: ['./billing-footer.component.scss'],
})
export class SharedSxmUiBillingFooterComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: { lastAmount: string; lastDate: string; daysSinceLastPayment: number };

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SharedSxmUiBillingFooterComponent],
    exports: [SharedSxmUiBillingFooterComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDatePipeModule],
})
export class SharedSxmUiBillingBillingFooterModule {}
