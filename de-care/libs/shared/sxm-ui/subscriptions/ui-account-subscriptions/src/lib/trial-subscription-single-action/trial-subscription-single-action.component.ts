import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

interface DataModel {
    duration: number;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-trial-subscription-single-action',
    templateUrl: './trial-subscription-single-action.component.html',
    styleUrls: ['./trial-subscription-single-action.component.scss'],
})
export class SxmUiTrialSubscriptionSingleActionComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() extendTrial = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiTrialSubscriptionSingleActionComponent],
    exports: [SxmUiTrialSubscriptionSingleActionComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiSubscriptionsUiTrialSubscriptionSingleActionModule {}
