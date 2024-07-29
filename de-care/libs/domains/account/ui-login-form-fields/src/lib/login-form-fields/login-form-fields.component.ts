import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter, pluck, startWith, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { SxmLanguages } from '@de-care/app-common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@de-care/settings';
import { DataValidationService } from '@de-care/data-services';
import { getSxmValidator, getValidateUniqueLoginServerFn, getValidatePasswordServerFn, getValidateUniqueUserNameLoginServerFn } from '@de-care/shared/validation';
import { Store } from '@ngrx/store';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';

export interface LoginFormInfo {
    canEditEmail?: boolean;
    email: string;
    emailControlName?: string;
    parentForm: FormGroup;
    passwordControlName?: string;
    verifyThirdParty?: boolean;
}

const DEFAULT_EMAIL_CONTROL_NAME = 'email';
const DEFAULT_PASSWORD_CONTROL_NAME = 'password';

@Component({
    selector: 'login-form-fields',
    templateUrl: './login-form-fields.component.html',
    styleUrls: ['./login-form-fields.component.scss'],
})
export class LoginFormFieldsComponent implements OnInit, OnDestroy {
    @Input() submitted = false;
    @Input() headerText: string;
    @Input() isStreamingFlow = false;
    @Input() useUsername = false;
    @Input() systemError = false;
    @Input() set formInfo(info: LoginFormInfo) {
        this.parentForm = info.parentForm;
        this.passwordControlName = !!info.passwordControlName ? info.passwordControlName : DEFAULT_PASSWORD_CONTROL_NAME;
        this.email = info.email;
        this.emailControlName = !!info.emailControlName ? info.emailControlName : DEFAULT_EMAIL_CONTROL_NAME;
        this.canEditEmail = info.canEditEmail || false;
        this._verifyThirdParty = info.verifyThirdParty;
        this.addControls();
    }

    @Input() set passwordError(passwordError: boolean) {
        if (passwordError && this.passwordControlName) {
            const passwordControl = this.parentForm.get(this.passwordControlName);
            if (passwordControl) {
                passwordControl.setErrors({ generic: true });
            }
        }
    }

    passwordControlName: string;
    parentForm: FormGroup;
    email: string;
    passwordElId = uuid();
    currentLang: SxmLanguages;
    private _unsubscribe: Subject<void> = new Subject();
    private _verifyThirdParty: boolean;
    emailControlName: string;
    canEditEmail: boolean;
    private _emailControlStatusSubscription: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _settingsService: SettingsService,
        private _dataValidationService: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store
    ) {
        this.currentLang = _translateService.currentLang as SxmLanguages;
    }

    ngOnInit() {
        this._listenForLang();
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
        this._emailControlStatusSubscription?.unsubscribe();
    }

    addControls(): void {
        if (!this._controlExists(this.parentForm, this.passwordControlName)) {
            this.parentForm.addControl(
                this.passwordControlName,
                this._formBuilder.control(null, {
                    validators: getSxmValidator('password', this._settingsService.settings.country, this.currentLang),
                    asyncValidators: getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()),
                    updateOn: 'blur',
                })
            );
        } else {
            const passwordControl = this.parentForm.get(this.passwordControlName);
            this._updateControlAsUntouched(passwordControl);
        }

        if (this._shouldIncludeEmailFormField()) {
            if (!this._controlExists(this.parentForm, this.emailControlName)) {
                this.parentForm.addControl(
                    this.emailControlName,
                    this._formBuilder.control(this.email || '', {
                        validators: getSxmValidator('email', this._settingsService.settings.country, this.currentLang),
                        asyncValidators: getValidateUniqueLoginServerFn(
                            this._dataValidationService,
                            1000,
                            this._changeDetectorRef,
                            this._verifyThirdParty,
                            this.isStreamingFlow
                        ),
                        updateOn: 'blur',
                    })
                );
            } else {
                const emailControl = this.parentForm.get(this.emailControlName);
                this._updateControlValue(emailControl, this.email);
            }
        }

        if (this._controlExists(this.parentForm, this.emailControlName) && this.useUsername) {
            this.parentForm.get(this.emailControlName).setValidators(getSxmValidator('registrationUserName', this._settingsService.settings.country, this.currentLang));
            this.parentForm
                .get(this.emailControlName)
                .setAsyncValidators(
                    getValidateUniqueUserNameLoginServerFn(this._dataValidationService, 1000, this._changeDetectorRef, this._verifyThirdParty, this.isStreamingFlow)
                );
        }

        const emailControl = this.parentForm.get('email');
        this._emailControlStatusSubscription = emailControl?.statusChanges
            .pipe(filter((status) => status === 'INVALID' && emailControl.hasError('usernameInUse')))
            .subscribe(() => {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Username in use or is not allowed'] }));
            });
    }

    private _updateControlValue(formControl: AbstractControl, value: any) {
        formControl.setValue(value);
        formControl.updateValueAndValidity();
    }

    private _updateControlAsUntouched(formControl: AbstractControl) {
        formControl.markAsPristine();
        formControl.markAsUntouched();
        formControl.updateValueAndValidity();
    }

    private _controlExists(form: FormGroup, controlName: string): boolean {
        return form.controls.hasOwnProperty(controlName);
    }

    private _listenForLang(): void {
        this._translateService.onLangChange
            .pipe(
                startWith({
                    lang: this._translateService.currentLang,
                    translations: null,
                } as LangChangeEvent),
                pluck('lang'),
                takeUntil(this._unsubscribe)
            )
            .subscribe((lang: string) => (this.currentLang = lang as SxmLanguages));
    }

    private _shouldIncludeEmailFormField() {
        // if configured to be able to edit email or it has an email value
        return this.canEditEmail || !!this.email;
    }
}
