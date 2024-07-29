import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiUsernameFormFieldModule } from '@de-care/shared/sxm-ui/ui-username-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid/v4';

interface DataModel {
    userName: string;
    password?: string;
    oldPassword?: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-edit-login-username-password',
    templateUrl: './edit-login-username-password.component.html',
    styleUrls: ['./edit-login-username-password.component.scss'],
})
export class SxmUiEditLoginUsernamePasswordComponent implements ComponentWithLocale, OnInit, OnChanges {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() formCompleted = new EventEmitter<DataModel>();
    @Output() cancel = new EventEmitter();
    @Input() username: string;
    @Input() set editLoginServerError(error: { type: 'PASSWORD_ERROR_POLICY' | 'PASSWORD_ERROR_RESERVED_WORD' | 'SYSTEM'; reservedWord?: string }) {
        switch (error?.type) {
            case 'PASSWORD_ERROR_POLICY': {
                this.editUsernamePasswordForm.get('password').setErrors({ generic: true });
                break;
            }
            case 'PASSWORD_ERROR_RESERVED_WORD': {
                this.editUsernamePasswordForm.get('password').setErrors({ reservedWords: { words: [error.reservedWord] } });
                break;
            }
            case 'SYSTEM': {
                this.showServerError = true;
                break;
            }
        }

        this.processing$.next(false);
    }
    showServerError = false;
    editUsernamePasswordForm: FormGroup;
    submitted = false;
    alwaysDisplayPasswordHint = false;
    reservedWords: string[] = [];
    processing$ = new BehaviorSubject(false);
    readonly newPasswordFieldId = uuid();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _formBuilder: FormBuilder, private _sxmValidators: SxmValidators) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.editUsernamePasswordForm = this._formBuilder.group({
            username: [
                this.username,
                {
                    validators: this._sxmValidators.username,
                    updateOn: 'blur',
                },
            ],
            oldPassword: [
                null,
                {
                    validators: this._sxmValidators.password,
                    updateOn: 'blur',
                },
            ],
            password: [
                null,
                {
                    validators: this._sxmValidators.password,
                    updateOn: 'blur',
                },
            ],
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (this.editUsernamePasswordForm && simpleChanges.data) {
            this.editUsernamePasswordForm.controls['username'].setValue(simpleChanges.data?.currentValue?.username);
            this.editUsernamePasswordForm.controls['password'].setValue(simpleChanges.data?.currentValue?.password);
            this.editUsernamePasswordForm.controls['oldPassword'].setValue(simpleChanges.data?.currentValue?.oldPassword);
        }
    }

    handleSubmission(event: { preventDefault: () => void }) {
        this.submitted = true;
        event.preventDefault();
        this.processing$.next(true);
        this.showServerError = false;
        this.editUsernamePasswordForm.markAllAsTouched();
        if (this.editUsernamePasswordForm.valid && this.editUsernamePasswordForm.value.password !== this.editUsernamePasswordForm.value.oldPassword) {
            this.formCompleted.emit({
                userName: this.editUsernamePasswordForm.value.username,
                password: this.editUsernamePasswordForm.value.password,
                oldPassword: this.editUsernamePasswordForm.value.oldPassword,
            });
        } else {
            this.processing$.next(false);
        }
    }

    onCancel() {
        this.clearForm();
        this.cancel.emit();
    }

    clearForm() {
        this.submitted = false;
        this.showServerError = false;
        this.editUsernamePasswordForm.markAsUntouched();
        this.editUsernamePasswordForm.reset();
    }
}

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiUsernameFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedValidationFormControlInvalidModule,
    ],
    declarations: [SxmUiEditLoginUsernamePasswordComponent],
    exports: [SxmUiEditLoginUsernamePasswordComponent],
})
export class SharedSxmUiEditLoginUsernamePasswordModule {}
