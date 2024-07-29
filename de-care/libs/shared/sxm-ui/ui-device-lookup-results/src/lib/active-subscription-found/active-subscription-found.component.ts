import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
interface SubscriptionInfo {
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
    selector: 'sxm-ui-active-subscription-found',
    templateUrl: './active-subscription-found.component.html',
    styleUrls: ['./active-subscription-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslateModule],
    standalone: true,
})
export class SxmUiActiveSubscriptionFoundComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    processingSubmission$ = new BehaviorSubject(false);

    @Input() subscriptionFound: SubscriptionInfo = null;
    @Output() signInRequested = new EventEmitter<boolean>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onFormSubmit() {
        this.processingSubmission$.next(true);
        this.signInRequested.emit(true);
    }

    setProcessingCompleted(): void {
        this.processingSubmission$.next(false);
    }
}
