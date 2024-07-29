import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
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
export interface MultiDeviceFoundComponentVM {
    flepzResultsForDisplay: SubscriptionInfo[];
    numberOfSubscriptionsFound: number;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-multiple-devices-found',
    templateUrl: './multiple-devices-found.component.html',
    styleUrls: ['./multiple-devices-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslateModule, ReactiveFormsModule, ReactiveComponentModule, CommonModule],
    standalone: true,
})
export class SxmUiMultipleDevicesFoundComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    processingSubmission$ = new BehaviorSubject(false);
    form: FormGroup;

    @Input() viewModel: MultiDeviceFoundComponentVM = null;

    @Output() deviceIdSelected = new EventEmitter<string>();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onFormSubmit(last4DigitsOfRadioId) {
        this.processingSubmission$.next(true);
        this.deviceIdSelected.emit(last4DigitsOfRadioId);
    }

    setProcessingCompleted(): void {
        this.processingSubmission$.next(false);
    }
}
