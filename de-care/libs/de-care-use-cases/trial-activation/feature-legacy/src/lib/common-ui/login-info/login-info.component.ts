import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { DataValidationService } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';
import { getSxmValidator, getValidateEmailByServerFn, getValidatePasswordServerFn } from '@de-care/shared/validation';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { pluck, startWith, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface FormInfo {
    canEditEmail?: boolean;
    email: string;
    emailControlName?: string;
    parentForm: FormGroup;
    passwordControlName?: string;
}

const DEFAULT_EMAIL_CONTROL_NAME = 'email';
const DEFAULT_PASSWORD_CONTROL_NAME = 'password';

@Component({
    selector: 'login-info',
    templateUrl: './login-info.component.html',
    styleUrls: ['./login-info.component.scss']
})
export class LoginInfoComponent implements OnInit, OnDestroy {
    @Input() submitted = false;

    @Input() set formInfo(info: FormInfo) {
        this.parentForm = info.parentForm;
        this.passwordControlName = !!info.passwordControlName ? info.passwordControlName : DEFAULT_PASSWORD_CONTROL_NAME;
        this.email = info.email;
        this.emailControlName = !!info.emailControlName ? info.emailControlName : DEFAULT_EMAIL_CONTROL_NAME;
        this.canEditEmail = info.canEditEmail || false;
        this.addControls();
    }

    passwordControlName: string;
    parentForm: FormGroup;
    email: string;
    passwordElId = uuid();
    currentLang: SxmLanguages;
    private _unsubscribe: Subject<void> = new Subject();
    emailControlName: string;
    canEditEmail: boolean;

    constructor(
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        private _settingsService: SettingsService,
        private _dataValidationService: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.currentLang = _translateService.currentLang as SxmLanguages;
    }

    ngOnInit() {
        this._listenForLang();
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    addControls(): void {
        if (!this._controlExists(this.parentForm, this.passwordControlName)) {
            this.parentForm.addControl(
                this.passwordControlName,
                this._formBuilder.control('', {
                    validators: getSxmValidator('password', this._settingsService.settings.country, this.currentLang),
                    asyncValidators: getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()),
                    updateOn: 'blur'
                })
            );
        }

        if (!this._controlExists(this.parentForm, this.emailControlName)) {
            this.parentForm.addControl(
                this.emailControlName,
                this._formBuilder.control(this.email || '', {
                    validators: getSxmValidator('email', this._settingsService.settings.country, this.currentLang),
                    asyncValidators: getValidateEmailByServerFn(this._dataValidationService, 1000, this._changeDetectorRef),
                    updateOn: 'blur'
                })
            );
        }
    }

    private _controlExists(form: FormGroup, controlName: string): boolean {
        return form.controls.hasOwnProperty(controlName);
    }

    private _listenForLang(): void {
        this._translateService.onLangChange
            .pipe(
                startWith({
                    lang: this._translateService.currentLang,
                    translations: null
                } as LangChangeEvent),
                pluck('lang'),
                takeUntil(this._unsubscribe)
            )
            .subscribe((lang: string) => (this.currentLang = lang as SxmLanguages));
    }
}
