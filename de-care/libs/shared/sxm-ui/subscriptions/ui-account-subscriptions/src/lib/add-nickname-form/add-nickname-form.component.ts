import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';
interface DataModel {
    vehicle?: string;
    radioId?: string;
    nickname?: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-add-nickname-form',
    templateUrl: './add-nickname-form.component.html',
    styleUrls: ['./add-nickname-form.component.scss'],
})
export class SxmUiAddNicknameFormComponent implements ComponentWithLocale, OnInit, OnChanges {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: DataModel;
    @Input() loading = false;
    @Input() error = false;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() cancel = new EventEmitter();
    @Output() formCompleted = new EventEmitter<string>();

    form: FormGroup;
    submitted = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _formBuilder: FormBuilder) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            nickname: [this.data?.nickname, Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9a-zA-ZÀ-ÿ\-' ]+$/)])],
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (this.form && simpleChanges.data) {
            this.form.controls['nickname'].setValue(simpleChanges.data?.currentValue?.nickname);
        }
    }

    handleSubmission(event: { preventDefault: () => void }) {
        this.submitted = true;
        event.preventDefault();
        if (this.form.valid) {
            this.formCompleted.emit(this.form.value.nickname);
        }
    }

    onCancel() {
        this.clearForm();
        this.cancel.emit();
    }

    clearForm() {
        this.submitted = false;
        this.error = false;
        this.form.markAsUntouched();
        this.form.reset();
        this.form.controls['nickname'].setValue(this.data?.nickname);
    }
}

@NgModule({
    declarations: [SxmUiAddNicknameFormComponent],
    exports: [SxmUiAddNicknameFormComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
})
export class SharedSxmUiSubscriptionsUiAddNicknameFormModule {}
