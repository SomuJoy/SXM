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
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-add-login-username-password',
    templateUrl: './add-login-username-password.component.html',
    styleUrls: ['./add-login-username-password.component.scss'],
})
export class SxmUiAddLoginUsernamePasswordComponent implements ComponentWithLocale, OnInit, OnChanges {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() formCompleted = new EventEmitter<DataModel>();
    @Output() cancel = new EventEmitter();
    @Input() username: string;
    @Input() set addLoginServerError(error: { type: 'PASSWORD_ERROR_POLICY' | 'PASSWORD_ERROR_RESERVED_WORD' | 'SYSTEM'; reservedWord?: string }) {
        switch (error?.type) {
            case 'PASSWORD_ERROR_POLICY': {
                this.addUsernamePasswordForm.get('password').setErrors({ generic: true });
                break;
            }
            case 'PASSWORD_ERROR_RESERVED_WORD': {
                this.addUsernamePasswordForm.get('password').setErrors({ reservedWords: { words: [error.reservedWord] } });
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
    addUsernamePasswordForm: FormGroup;
    submitted = false;
    alwaysDisplayPasswordHint = false;
    reservedWords: string[] = [];
    processing$ = new BehaviorSubject(false);
    readonly newPasswordFieldId = uuid();

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _formBuilder: FormBuilder, private _sxmValidators: SxmValidators) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.addUsernamePasswordForm = this._formBuilder.group({
            username: [
                this.username,
                {
                    validators: this._sxmValidators.username,
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
        if (this.addUsernamePasswordForm && simpleChanges.data) {
            this.addUsernamePasswordForm.controls['username'].setValue(simpleChanges.data?.currentValue?.username);
            this.addUsernamePasswordForm.controls['password'].setValue(simpleChanges.data?.currentValue?.password);
        }
    }

    handleSubmission(event: { preventDefault: () => void }) {
        this.submitted = true;
        event.preventDefault();
        this.processing$.next(true);
        this.showServerError = false;
        this.addUsernamePasswordForm.markAllAsTouched();
        if (this.addUsernamePasswordForm.valid) {
            this.formCompleted.emit({
                userName: this.addUsernamePasswordForm.value.username,
                password: this.addUsernamePasswordForm.value.password,
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
        this.addUsernamePasswordForm.markAsUntouched();
        this.addUsernamePasswordForm.reset();
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
    declarations: [SxmUiAddLoginUsernamePasswordComponent],
    exports: [SxmUiAddLoginUsernamePasswordComponent],
})
export class SharedSxmUiAddLoginUsernamePasswordModule {}
