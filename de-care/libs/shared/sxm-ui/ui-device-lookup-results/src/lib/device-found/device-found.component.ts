import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export interface SubscriptionInfo {
    vehicleInfo?: {
        year?: string;
        make?: string;
        model?: string;
    };
    last4DigitsOfRadioId?: string;
    planNames?: string[];
    isClosed?: boolean;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-device-found',
    templateUrl: './device-found.component.html',
    styleUrls: ['./device-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslateModule, SharedSxmUiUiProceedButtonModule],
    standalone: true,
})
export class SxmUiDeviceFoundComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    processingSubmission$ = new BehaviorSubject(false);

    @Input() subscriptionFound: SubscriptionInfo = null;
    @Output() deviceIdSelected = new EventEmitter<string>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onFormSubmit() {
        this.processingSubmission$.next(true);
        this.deviceIdSelected.emit(this.subscriptionFound.last4DigitsOfRadioId);
    }

    setProcessingCompleted(): void {
        this.processingSubmission$.next(false);
    }
}
