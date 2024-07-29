import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as uuid from 'uuid/v4';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/validation';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { SettingsService } from '@de-care/settings';
import { buildAndJoinTranslation, initiateTranslationOverride, SxmLanguages, TranslationOverrides } from '@de-care/app-common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccountDataRequest, AccountModel, DataAccountService, RadioModel, SubscriptionModel } from '@de-care/data-services';
import { RadioIdLookupService } from '../../radio-id-lookup.service';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { Action, Store } from '@ngrx/store';
import {
    behaviorEventReactionAccountInfoFormClientSideValidationErrors,
    behaviorEventReactionLookupByAccountNumberAndRadioIdFailure,
    behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess,
    behaviorEventReactionLookupByRadioIdFailure,
    behaviorEventReactionLookupByRadioIdSuccess,
    behaviorEventReactionAuthenticationByAccountNumberAndRadioIdSuccess,
} from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'account-id-info',
    templateUrl: './account-id-info.component.html',
    styleUrls: ['./account-id-info.component.scss'],
})
export class AccountIdInfoComponent implements OnChanges, OnInit, OnDestroy {
    @Input() translationOverrides: TranslationOverrides;
    @Input() lastNameBasedLookup = false;
    @Input() radioIdInput: string;
    @Output() deviceHelp = new EventEmitter();
    @Output() licensePlateHelp = new EventEmitter();
    @Output() accountInfoFound = new EventEmitter<AccountModel & { last4DigitsOfAccountNumber?: string }>();
    @Output() activeSubscriptionFound = new EventEmitter<SubscriptionModel>();
    @Output() accountVerificationRequired = new EventEmitter<{ account: AccountModel; radio: RadioModel }>();
    uniqueIdRadio: string = uuid();
    uniqueIdAct: string = uuid();
    uniqueIdLast: string = uuid();
    submitted: boolean = false;
    loading: boolean = false;
    radioId: string;
    accountNumber: string;
    lastName: string;
    currentLang: SxmLanguages;
    accountInfoForm: FormGroup;
    accountNotSupportedError = false;

    private $langChangeSubscription: Subscription;

    controlIsInvalid: (control: AbstractControl) => boolean = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(
        private _formBuilder: FormBuilder,
        private _settingsService: SettingsService,
        private _translateService: TranslateService,
        private _dataAccountService: DataAccountService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _radioIdLookupService: RadioIdLookupService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: Store
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.translationOverrides && changes.translationOverrides.currentValue !== changes.translationOverrides.previousValue) {
            initiateTranslationOverride(this.translationOverrides).map((flatTranslation) =>
                flatTranslation
                    .map(buildAndJoinTranslation('identification', 'accountIdInfoComponent'))
                    .forEach(({ locale, translation }) => this._translateService.setTranslation(locale, translation, true))
            );
        }
    }

    private _trackClientValidationErrors() {
        if (this.accountInfoForm) {
            const errors = [];
            if ((this.submitted || !this.accountInfoForm.controls.radioId.pristine) && this.accountInfoForm.controls.radioId.errors) {
                errors.push('Auth - Missing or invalid radio id');
            }
            if (
                this.accountInfoForm.controls.lastName &&
                (this.submitted || !this.accountInfoForm.controls.lastName.pristine) &&
                this.accountInfoForm.controls.lastName.errors
            ) {
                errors.push('Auth - Missing or invalid last name');
            }
            if (
                this.accountInfoForm.controls.accountNumber &&
                (this.submitted || !this.accountInfoForm.controls.accountNumber.pristine) &&
                this.accountInfoForm.controls.accountNumber.errors
            ) {
                errors.push('Auth - Missing or invalid account number');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventReactionAccountInfoFormClientSideValidationErrors({ errors }));
            }
        }
    }

    ngOnInit() {
        this.accountInfoForm = this.buildForm();
        this.currentLang = this._translateService.currentLang as SxmLanguages;
        this.setFormLangValidations();
        this.$langChangeSubscription = this._translateService.onLangChange.subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
            this.setFormLangValidations(true);
        });
    }

    buildForm(): FormGroup {
        const formGroup: FormGroup = this._formBuilder.group({
            radioId: [
                this.radioIdInput?.trim() || '',
                {
                    updateOn: 'blur',
                },
            ],
        });

        if (this.lastNameBasedLookup) {
            formGroup.addControl(
                'lastName',
                new FormControl('', {
                    updateOn: 'blur',
                })
            );
        } else {
            formGroup.addControl(
                'accountNumber',
                new FormControl('', {
                    updateOn: 'blur',
                })
            );
        }

        return formGroup;
    }

    private setFormLangValidations(updateValuesAndValidities: boolean = false) {
        const radioIdControl = this.accountInfoForm.get('radioId');
        const accountNumberControl = this.accountInfoForm.get('accountNumber');
        const lastNameControl = this.accountInfoForm.get('lastName');

        radioIdControl.setValidators(getSxmValidator('radioId', this._settingsService.settings.country, this.currentLang));
        if (accountNumberControl) {
            accountNumberControl.setValidators(getSxmValidator('accountNumber', this._settingsService.settings.country, this.currentLang));
        }
        if (lastNameControl) {
            lastNameControl.setValidators(getSxmValidator('lastName', this._settingsService.settings.country, this.currentLang));
        }

        if (updateValuesAndValidities) {
            radioIdControl.updateValueAndValidity();
            if (accountNumberControl) {
                accountNumberControl.updateValueAndValidity();
            }
            if (lastNameControl) {
                lastNameControl.updateValueAndValidity();
            }
        }
    }

    doAccountSearch() {
        this.submitted = true;
        this.accountNotSupportedError = false;
        if (this.accountInfoForm.valid) {
            this.loading = true;
            const accountDataRequest: AccountDataRequest = { radioId: this.accountInfoForm.value.radioId };
            const accountNumber = this.accountInfoForm.value.accountNumber;
            if (accountNumber) {
                accountDataRequest.accountNumber = accountNumber;
            }
            if (this.accountInfoForm.value.lastName) {
                accountDataRequest.lastName = this.accountInfoForm.value.lastName;
            }
            this._nonPiiSrv.build(accountDataRequest).subscribe(
                (account) => {
                    const subscription = account.subscriptions && account.subscriptions.length > 0 ? account.subscriptions[0] : null;
                    if (this._dataAccountService.accountHasActiveSubscription(subscription)) {
                        this.activeSubscriptionFound.emit(subscription);
                    } else {
                        this.accountInfoFound.emit(account);
                    }
                    this.loading = false;
                    if (accountNumber) {
                        this._store.dispatch(behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess());
                        this._store.dispatch(behaviorEventReactionAuthenticationByAccountNumberAndRadioIdSuccess());
                    } else {
                        this._store.dispatch(behaviorEventReactionLookupByRadioIdSuccess());
                    }
                },
                (error) => {
                    const fieldErrors = error.error.error.fieldErrors;
                    if (fieldErrors && fieldErrors.find((fieldError) => fieldError.fieldName === 'radioId')) {
                        this.accountInfoForm.controls.radioId.setErrors({ invalid: true });
                        this.loading = false;
                    } else if (fieldErrors && fieldErrors.find((fieldError) => fieldError.fieldName === 'accountNumber' || fieldError.fieldName === 'lastName')) {
                        this._radioIdLookupService.lookupAccountByRadioId(this.accountInfoForm.value.radioId).subscribe(
                            ({ account, radio }) => {
                                this.accountVerificationRequired.emit({ account, radio });
                                this.loading = false;
                            },
                            () => this._handleUnknownError()
                        );
                    } else if (error.error.error.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                        this.accountNotSupportedError = true;
                        this.loading = false;
                    } else {
                        // unknown error
                        this._handleUnknownError();
                    }
                    let eventReactionAction: Action;
                    if (accountNumber) {
                        eventReactionAction = behaviorEventReactionLookupByAccountNumberAndRadioIdFailure();
                    } else {
                        eventReactionAction = behaviorEventReactionLookupByRadioIdFailure();
                    }
                    this._store.dispatch(eventReactionAction);
                    this._changeDetectorRef.markForCheck();
                }
            );
        } else {
            this._trackClientValidationErrors();
        }
    }

    ngOnDestroy() {
        this.$langChangeSubscription.unsubscribe();
    }

    private _handleUnknownError(): void {
        // (setting radio id error to display an error here)
        this.accountInfoForm.controls.radioId.setErrors({ invalid: true });
        this.loading = false;
    }
}
