import { Component, OnInit, AfterViewInit, EventEmitter, Output, OnDestroy, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { getSxmValidator } from '@de-care/shared/validation';
import { behaviorEventImpressionForComponent, behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { VerifyAccountByLpzWorkflowService } from '@de-care/domains/account/state-account';
import { SxmLanguages } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

export interface ValidateLpzFormComponentApi {
    reset(): void;
    setProcessingCompleted(): void;
}

@Component({
    selector: 'identification-validate-lpz-form',
    templateUrl: './validate-lpz-form.component.html',
    styleUrls: ['./validate-lpz-form.component.scss'],
})
export class ValidateLpzFormComponent implements OnInit, AfterViewInit, OnDestroy, ValidateLpzFormComponentApi {
    translateKeyPrefix = 'DomainsIdentificationUiValidateLpzFormModule.ValidateLpzFormComponent.';
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    isInvalidError$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    langChangeSubscription: Subscription;
    isCanada = this._countrySettings.countryCode === 'ca';
    @Input() displayPrivacyPolicy = false;
    @Output() lpzValidated = new EventEmitter<boolean>();

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _store: Store,
        private readonly _verifyAccountByLpzWorkflowService: VerifyAccountByLpzWorkflowService,
        private readonly _translateService: TranslateService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    reset(): void {
        this.processing$.next(false);
        this.isInvalidError$.next(false);
        this.isSystemError$.next(false);
        this.form.reset();
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            lastName: ['', { validators: getSxmValidator('lastName'), updateOn: 'blur' }],
            phoneNumber: ['', { validators: getSxmValidator('phoneNumber'), updateOn: 'blur' }],
            zipCode: ['', { validators: getSxmValidator('zipCode'), updateOn: 'blur' }],
        });

        if (this.isCanada) {
            this._setZipCodeValidator('ca', this._translateService.currentLang as SxmLanguages);
            this.langChangeSubscription = this._translateService.onLangChange.subscribe(({ lang }) => {
                this._setZipCodeValidator('ca', lang as SxmLanguages);
            });
        }
    }

    setProcessingCompleted() {
        this.processing$.next(false);
    }

    private _setZipCodeValidator(country: 'ca' | 'us', lang: SxmLanguages) {
        this.form.controls.zipCode.setValidators(getSxmValidator('zipCode', country, lang));
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onSubmit() {
        this.processing$.next(true);
        this.isInvalidError$.next(false);
        this.isSystemError$.next(false);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            const { lastName, phoneNumber, zipCode } = this.form.value;
            this._verifyAccountByLpzWorkflowService
                .build({ lastName, phoneNumber, zipCode })
                .pipe(catchError(() => throwError('SYSTEM')))
                .subscribe({
                    next: (valid) => {
                        this.lpzValidated.next(valid);
                        if (!valid) {
                            this.isSystemError$.next(true);
                        }
                    },
                    error: (error) => {
                        if (error?.error?.error?.fieldErrors[0].errorType === 'BUSINESS') {
                            this.isInvalidError$.next(true);
                        } else {
                            this.isSystemError$.next(true);
                        }
                        this.processing$.next(false);
                    },
                });
        } else {
            const errors = [];
            if (this.form.controls.lastName.errors) {
                errors.push('Missing last name');
            }
            if (this.form.controls.phoneNumber.errors) {
                errors.push('Missing or invalid phone number');
            }
            if (this.form.controls.zipCode.errors) {
                errors.push('Missing or invalid zip code');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
    }

    ngOnDestroy(): void {
        if (this.langChangeSubscription) {
            this.langChangeSubscription.unsubscribe();
        }
    }
}
