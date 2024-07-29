import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DataModel {
    plan: string;
    price: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-activate-radio-single-action',
    templateUrl: './activate-radio-single-action.component.html',
    styleUrls: ['./activate-radio-single-action.component.scss'],
})
export class SxmUiActivateRadioSingleActionComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() activateRadio = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiActivateRadioSingleActionComponent],
    exports: [SxmUiActivateRadioSingleActionComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule {}
