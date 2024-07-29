import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
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
    selector: 'sxm-ui-remove-inactive-radio-form',
    templateUrl: './remove-inactive-radio-form.component.html',
    styleUrls: ['./remove-inactive-radio-form.component.scss'],
})
export class SxmUiRemoveInactiveRadioFormComponent implements ComponentWithLocale, OnInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    reasonSelectorForm: FormGroup;
    submitted = false;
    selectionErrorMessage = false;
    @Input() removeInactiveRadioServerError = false;
    @Input() loading = false;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() userSelectedReason: EventEmitter<string | void> = new EventEmitter();
    @Output() userCancel: EventEmitter<string | void> = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _formBuilder: FormBuilder) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.reasonSelectorForm = this.buildForm();
    }

    private buildForm() {
        return this._formBuilder.group({ reason: ['', Validators.required] });
    }

    submitSelectedReason(event: { preventDefault: () => void }) {
        this.submitted = true;
        event.preventDefault();
        if (this.reasonSelectorForm.valid) {
            this.selectionErrorMessage = false;
            this.userSelectedReason.emit(this.reasonSelectorForm.controls.reason.value);
        } else {
            this.selectionErrorMessage = true;
        }
    }

    onCancel() {
        this.clearForm();
        this.userCancel.emit();
    }

    clearForm() {
        this.selectionErrorMessage = false;
        this.reasonSelectorForm.markAsUntouched();
        this.reasonSelectorForm.reset();
        this.submitted = false;
    }
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiDropdownFormFieldModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiProceedButtonModule,
    ],
    declarations: [SxmUiRemoveInactiveRadioFormComponent],
    exports: [SxmUiRemoveInactiveRadioFormComponent],
})
export class SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule {}
