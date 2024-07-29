import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
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
    selector: 'sxm-ui-billing-ebill-opt-out',
    templateUrl: './billing-ebill-opt-out.component.html',
    styleUrls: ['./billing-ebill-opt-out.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SharedSxmUiBillingEbillOptOutComponent implements ComponentWithLocale {

    languageResources: LanguageResources;
    translateKeyPrefix: string;
    submitted = false;
    @Input() switchToPaperServerError = false;
    @Input() loading = false;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() switchToPaper: EventEmitter<void> = new EventEmitter();
    @Output() keepEBill: EventEmitter<void> = new EventEmitter();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService
    ) {
        translationsForComponentService.init(this);
    }

    onOptOut() {
        this.switchToPaper.emit();
    }

    onKeepEBill() {
        this.keepEBill.emit();
    }

}

@NgModule({
    declarations: [SharedSxmUiBillingEbillOptOutComponent],
    exports: [SharedSxmUiBillingEbillOptOutComponent],
    imports: [
        CommonModule,
        SharedSxmUiUiEmailFormFieldModule,
        CommonModule,
        TranslateModule.forChild(),
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiProceedButtonModule,
    ],
})
export class SharedSxmUiBillingEbillOptOutComponentModule { }
