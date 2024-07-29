import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomerFlepzLookupWorkflowService } from '@de-care/domains/identity/state-flepz-lookup';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { FlepzData, FlepzLookupFormComponent, FlepzLookupFormComponentApi } from '../flepz-lookup-form/flepz-lookup-form.component';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'flepz-lookup',
    templateUrl: './flepz-lookup.component.html',
    styleUrls: ['./flepz-lookup.component.scss'],
    imports: [CommonModule, TranslateModule, FlepzLookupFormComponent],
    standalone: true,
})
export class FlepzLookupComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Output() signInRequested = new EventEmitter();
    @Output() lookupCompleted = new EventEmitter();
    @Input() isInvalidEmailErrors: boolean;
    @Input() isInvalidFirstNameErrors: boolean;
    @ViewChild(FlepzLookupFormComponent) private readonly _flepzForm: FlepzLookupFormComponentApi;

    constructor(private readonly _flepzLookupWorkflowService: CustomerFlepzLookupWorkflowService, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    onFormSubmitted(flepzData: FlepzData) {
        this._flepzLookupWorkflowService.build(flepzData).subscribe({
            next: () => {
                this.lookupCompleted.emit(true);
                this._flepzForm.setProcessingCompleted();
            },
            error: () => {
                this._flepzForm.showSystemError();
                this._flepzForm.setProcessingCompleted();
            },
        });
    }
}
