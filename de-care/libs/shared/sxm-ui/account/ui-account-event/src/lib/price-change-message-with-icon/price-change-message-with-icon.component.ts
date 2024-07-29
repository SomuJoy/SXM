import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input } from '@angular/core';
import { SharedSxmUiUiIconInfoModule } from '@de-care/shared/sxm-ui/ui-icon-info';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DataModel {
    date: string;
    url: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-price-change-message-with-icon',
    template: `
        <mat-icon svgIcon="info"></mat-icon>
        <p>
            <span [innerHTML]="translateKeyPrefix + '.MESSAGE' | translate: { date: data?.date | sxmUiDate: 'longDate' }"></span
            ><a [href]="data?.url" target="_blank">{{ translateKeyPrefix + '.URL_LABEL' | translate }}</a>
        </p>
    `,
    styleUrls: ['./price-change-message-with-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPriceChangeMessageWithIconComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() data: DataModel;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiPriceChangeMessageWithIconComponent],
    exports: [SxmUiPriceChangeMessageWithIconComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconInfoModule, SharedSxmUiUiDatePipeModule],
})
export class SxmUiPriceChangeMessageWithIconComponentModule {}
