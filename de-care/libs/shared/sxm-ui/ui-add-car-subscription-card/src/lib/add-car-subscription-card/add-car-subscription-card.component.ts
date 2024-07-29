import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiIconAddCarModule } from '@de-care/shared/sxm-ui/ui-icon-add-car';
import { SharedSxmUiCurrencyPipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

export interface Data {
    clickTrackType: string;
    termLength: number;
    price: number;
    noFees: boolean;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-add-car-subscription-card',
    templateUrl: './add-car-subscription-card.component.html',
    styleUrls: ['./add-car-subscription-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiAddCarSubscriptionCardComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() data: Data;
    @Output() addCarSubscriptionButtonClick = new EventEmitter<null>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'add-car-subscription-card' }));
    }
}

@NgModule({
    declarations: [SxmUiAddCarSubscriptionCardComponent],
    exports: [SxmUiAddCarSubscriptionCardComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconAddCarModule, SharedSxmUiUiDataClickTrackModule, SharedSxmUiCurrencyPipeModule],
})
export class SxmUiAddCarSubscriptionCardComponentModule {}
