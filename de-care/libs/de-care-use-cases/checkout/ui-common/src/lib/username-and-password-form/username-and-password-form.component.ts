import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { UserNameAndPasswordValidationWorkFlow, UserNameAndPasswordValidationWorkFlowError } from '@de-care/domains/customer/state-customer-verification';

export interface UserNameAndPasswordFormComponentApi {
    setProcessingCompleted(): void;
}

@Component({
    selector: 'de-care-username-and-password-form',
    templateUrl: './username-and-password-form.component.html',
    styleUrls: ['./username-and-password-form.component.scss'],
})
export class UsernameAndPasswordFormComponent implements UserNameAndPasswordFormComponentApi {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.UsernameAndPasswordFormComponent.';
    userNamePasswordForm: FormGroup;
    accountLookupFormSystemError = false;
    userNamePasswordProcessing$ = new BehaviorSubject(false);
    @Input() set initialState(creds: { userName: string; password: string }) {
        if (creds?.userName) {
            this.userNamePasswordForm.get('userName').setValue(creds.userName);
        }
        if (creds?.password) {
            this.userNamePasswordForm.get('password').setValue(creds.password);
        }
    }
    @Output() formCompleted = new EventEmitter<string>();

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _sxmValidators: SxmValidators,
        private readonly _userNameAndPasswordValidationWorkFlow: UserNameAndPasswordValidationWorkFlow
    ) {
        this.userNamePasswordForm = this._formBuilder.group({
            userName: new FormControl(null, this._sxmValidators.username),
            password: new FormControl(null, { validators: [this._sxmValidators.password], updateOn: 'blur' }),
        });
    }

    validateInfo() {
        this.userNamePasswordForm.markAllAsTouched();
        this.userNamePasswordProcessing$.next(true);
        if (this.userNamePasswordForm.valid) {
            this._userNameAndPasswordValidationWorkFlow.build(this.userNamePasswordForm.value).subscribe({
                next: (resp) => {
                    this.userNamePasswordProcessing$.next(false);
                    this.formCompleted.next(this.userNamePasswordForm.value);
                },
                error: (error: UserNameAndPasswordValidationWorkFlowError) => {
                    this.userNamePasswordProcessing$.next(false);
                    switch (error.type) {
                        case 'EMAIL_ERROR_IN_USE': {
                            this.userNamePasswordForm.get('userName').setErrors({ usernameInUse: true });
                            break;
                        }
                        case 'EMAIL_ERROR_INVALID': {
                            this.userNamePasswordForm.get('userName').setErrors({ invalid: true });
                            break;
                        }
                        case 'PASSWORD_ERROR_POLICY': {
                            this.userNamePasswordForm.get('password').setErrors({ generic: true });
                            break;
                        }
                        case 'PASSWORD_ERROR_RESERVED_WORD': {
                            this.userNamePasswordForm.get('password').setErrors({ reservedWord: { word: error.reservedWord } });
                            break;
                        }
                        case 'SYSTEM': {
                            this.accountLookupFormSystemError = true;
                            break;
                        }
                    }
                },
            });
        } else {
            this.userNamePasswordProcessing$.next(false);
        }
    }

    setProcessingCompleted() {
        this.userNamePasswordProcessing$.next(false);
    }
}
