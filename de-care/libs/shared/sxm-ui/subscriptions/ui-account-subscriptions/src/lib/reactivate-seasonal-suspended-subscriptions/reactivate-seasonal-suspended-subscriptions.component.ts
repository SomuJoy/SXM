import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-reactivate-seasonal-suspended-subscriptions',
    templateUrl: './reactivate-seasonal-suspended-subscriptions.component.html',
    styleUrls: ['./reactivate-seasonal-suspended-subscriptions.component.scss'],
})
export class SxmUiReactivateSeasonalSuspendedSubscriptionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Output() userClosed = new EventEmitter();
    @Input() ariaDescribedbyTextId = uuid();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiReactivateSeasonalSuspendedSubscriptionsComponent],
    exports: [SxmUiReactivateSeasonalSuspendedSubscriptionsComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule {}
