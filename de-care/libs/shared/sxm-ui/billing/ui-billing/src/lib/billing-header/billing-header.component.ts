import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { SharedSxmUiUiIconBillingSummaryModule } from '@de-care/shared/sxm-ui/ui-icon-billing-summary';
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
    selector: 'sxm-ui-billing-header',
    templateUrl: './billing-header.component.html',
    styleUrls: ['./billing-header.component.scss'],
})
export class SharedSxmUiBillingHeaderComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() title: string;
    @Input() warning: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SharedSxmUiBillingHeaderComponent],
    exports: [SharedSxmUiBillingHeaderComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconBillingSummaryModule],
})
export class SharedSxmUiBillingBillingHeaderModule {}
