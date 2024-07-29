import { Component, Input } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

export interface GridRowColumnModel {
    label?: string;
    checkmark?: boolean;
    linkUrl?: string;
    itemName?: string;
}

export interface GridRowViewModel {
    title: string;
    tooltip?: string;
    tooltipId?: string;
    columns: GridRowColumnModel[];
    dataE2e?: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-grid-row',
    templateUrl: './grid-row.component.html',
    styleUrls: ['grid-row.component.scss'],
})
export class GridRowComponent implements ComponentWithLocale {
    @Input() gridRowVM: GridRowViewModel;
    @Input() selectedIndex: number;

    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
