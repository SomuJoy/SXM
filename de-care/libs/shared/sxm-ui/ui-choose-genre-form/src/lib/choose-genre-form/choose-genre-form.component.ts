import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOptionWithTooltipFormFieldSetOption } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field-set';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-choose-genre-form',
    templateUrl: './choose-genre-form.component.html',
    styleUrls: ['./choose-genre-form.component.scss']
})
export class SxmUiChooseGenreFormComponent {
    @Input() formOptions: RadioOptionWithTooltipFormFieldSetOption[];
    @Input() defaultOptionSelected: string;
    @Input() useReviewButtonText: boolean = false;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() stepComplete = new EventEmitter<string>();

    genreForm: FormGroup;
    formSubmitted = false;
    translationKey = 'SharedSxmUiUiChooseGenreFormModule.chooseGenreFormComponent.';

    constructor(private _formBuilder: FormBuilder) {}

    ngOnInit() {
        this.genreForm = this._formBuilder.group({
            option: [this.defaultOptionSelected || null, Validators.required]
        });
    }

    submitForm() {
        this.formSubmitted = true;
        if (this.genreForm.valid) {
            this.stepComplete.emit(this.genreForm.value.option);
        }
    }
}
