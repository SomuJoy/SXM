import { Component, OnInit, OnChanges, Input, Optional, ChangeDetectorRef, SimpleChanges, OnDestroy } from '@angular/core';
import {
    FormGroup,
    AbstractControl,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    FormBuilder,
    ValidationErrors,
    FormControl,
    NG_ASYNC_VALIDATORS,
    AsyncValidator,
} from '@angular/forms';
// TODO: move these out of shared so they can be imported with a short path and not result in a circular dependency
import { getValidateEmailByServerFn, getSxmValidator } from '@de-care/shared/validation';
import { DataValidationService } from '@de-care/data-services';
import { Observable, of, Subscription } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { SettingsService } from '@de-care/settings';
import { SxmLanguages } from '@de-care/app-common';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventReactionFlepzFormClientSideValidationErrors } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

export interface SharedFlepzFormFieldsComponentApi {
    clearForm: () => void;
    firstName: AbstractControl;
    lastName: AbstractControl;
}

@Component({
    selector: 'sxm-ui-flepz-form-fields',
    templateUrl: './flepz-form-fields.component.html',
    styleUrls: ['./flepz-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiFlepzFormFieldsComponent,
            multi: true,
        },
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: SxmUiFlepzFormFieldsComponent,
            multi: true,
        },
    ],
})
export class SxmUiFlepzFormFieldsComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, AsyncValidator, SharedFlepzFormFieldsComponentApi {
    // TODO: look into issue where changing the includeZip input doesn't work after ngOnInit because the form was already created
    // - could be fixed with setter, and update form control value
    @Input() includeZip = true;
    @Input() includeEmail = true;
    @Input() submitted = false;
    @Input() isInvalidPhone = false;
    @Input() emailEVSValidation = false;
    @Input() prefilledAccountData: {
        firstName: string;
        lastName: string;
    };

    readonly firstNameId = uuid();
    readonly lastNameId = uuid();
    readonly phoneId = uuid();
    readonly zipId = uuid();
    readonly emailId = uuid();
    isCanada = false;
    flepzForm: FormGroup;
    private $langChangeSubscription: Subscription;
    currentLang: SxmLanguages;

    get frmControls(): {
        [key: string]: AbstractControl;
    } {
        return this.flepzForm.controls;
    }

    constructor(
        private translate: TranslateService,
        private formBuilder: FormBuilder,
        private _dataValidationSrv: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef,
        public settingsSrv: SettingsService,
        private readonly _store: Store
    ) {}

    ngOnInit() {
        this.currentLang = this.translate.currentLang as SxmLanguages;
        this.isCanada = this.settingsSrv.isCanadaMode;
        this.flepzForm = this.startFlepzForm();
        this.includeEmail && this._addEmailField();
        this.$langChangeSubscription = this.translate.onLangChange.subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
            // TODO: reload validators on lang toggle
            // this.flepzForm = this.startFlepzForm();
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.isInvalidPhone && this.isInvalidPhone) {
            this.frmControls.phoneNumber.setErrors({ notValid: true });
            if (this.frmControls.phoneNumber.errors) {
                const errors = ['Auth - Missing or invalid phone number'];
                this._store.dispatch(behaviorEventReactionFlepzFormClientSideValidationErrors({ errors }));
            }
        }
        if (simpleChanges.submitted) {
            this._trackClientValidationErrors();
        }

        const includeEmailChanges = simpleChanges.includeEmail;
        if (this.flepzForm && includeEmailChanges && includeEmailChanges.currentValue !== includeEmailChanges.previousValue) {
            this._handleEmailHideOrShow();
        }
    }

    ngOnDestroy() {
        this.$langChangeSubscription.unsubscribe();
    }
    clearForm() {
        this.flepzForm.reset();
        this.submitted = false;
    }

    get firstName() {
        return this.flepzForm?.controls?.firstName;
    }
    get lastName() {
        return this.flepzForm?.controls?.lastName;
    }

    public onTouched: () => void = () => {};

    writeValue(val: any): void {
        val && this.flepzForm.setValue(val, { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.flepzForm.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(c: FormControl): Observable<ValidationErrors | null> {
        this._trackClientValidationErrors();
        const invalidForm = { invalidForm: { valid: false, message: 'flepz fields are invalid' } };
        // generic way for checking if there is some async validation pending
        if (this.flepzForm.pending) {
            return this.flepzForm.statusChanges.pipe(
                filter((value) => value !== 'PENDING'),
                map(() => {
                    return this.flepzForm.valid ? null : invalidForm;
                }),
                take(1)
            );
        } else {
            return of(this.flepzForm.valid ? null : invalidForm);
        }
    }

    private _trackClientValidationErrors() {
        if (this.flepzForm) {
            const errors = [];
            if ((this.submitted || !this.frmControls.firstName.pristine) && this.frmControls.firstName.errors) {
                errors.push('Auth - Missing or invalid first name');
            }
            if ((this.submitted || !this.frmControls.lastName.pristine) && this.frmControls.lastName.errors) {
                errors.push('Auth - Missing or invalid last name');
            }
            if (this.includeEmail && (this.submitted || !this.frmControls.email.pristine) && this.frmControls.email.errors) {
                errors.push('Auth - Missing or invalid email');
            }
            if ((this.submitted || !this.frmControls.phoneNumber.pristine) && this.frmControls.phoneNumber.errors) {
                errors.push('Auth - Missing or invalid phone number');
            }
            if (this.includeZip && (this.submitted || !this.frmControls.zipCode.pristine) && this.frmControls.zipCode.errors) {
                errors.push('Auth - Missing or invalid zip code');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventReactionFlepzFormClientSideValidationErrors({ errors }));
            }
        }
    }

    private startFlepzForm(): FormGroup {
        return this.formBuilder.group({
            firstName: [
                this.prefilledAccountData && this.prefilledAccountData.firstName ? this.prefilledAccountData.firstName : '',
                getSxmValidator('firstNameForLookup', this.settingsSrv.settings.country, this.currentLang),
            ],
            lastName: [
                this.prefilledAccountData && this.prefilledAccountData.lastName ? this.prefilledAccountData.lastName : '',
                getSxmValidator('lastNameForLookup', this.settingsSrv.settings.country, this.currentLang),
            ],
            // validation already handled by the component using the form
            phoneNumber: this.formBuilder.control('', {
                updateOn: 'blur',
                validators: getSxmValidator('phoneNumber'),
            }),
            ...(this.includeZip && {
                zipCode: this.formBuilder.control('', {
                    validators: getSxmValidator('zipCodeForLookup', this.settingsSrv.settings.country, this.currentLang),
                    updateOn: 'blur',
                }),
            }),
        });
    }

    private _handleEmailHideOrShow(): void {
        if (this.includeEmail) {
            if (!this.frmControls.email) {
                this._addEmailField();
            }
        } else {
            this.flepzForm.removeControl('email');
        }
    }

    private _addEmailField() {
        const emailEvsValidator = getValidateEmailByServerFn(this._dataValidationSrv, 0, this._changeDetectorRef);
        this.flepzForm.addControl(
            'email',
            new FormControl('', {
                validators: getSxmValidator('emailForLookup', this.settingsSrv.settings.country, this.currentLang),
                asyncValidators: this.emailEVSValidation ? [emailEvsValidator] : undefined,
            })
        );
    }
}
