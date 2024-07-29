import { Component, EventEmitter, OnDestroy, OnInit, Output, AfterViewInit, Input, ViewChild, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { DataTrialService, radioOrVinType, UsedCarTrialResponse, radioLastFour, VehicleModel } from '@de-care/data-services';
import { SettingsService, sxmCountries } from '@de-care/settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { getSxmValidator } from '@de-care/shared/validation';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RflzErrorData } from '../rflz-error/rflz-error.component';
import { Store } from '@ngrx/store';
import {
    behaviorEventImpressionForPage,
    behaviorEventReactionRflzFormClientSideValidationErrors,
    behaviorEventReactionRflzLookupFailure,
    behaviorEventReactionRflzLookupSuccess,
    behaviorEventReactionRflzDeviceInfoVin,
    behaviorEventReactionUsedCarEligibilityCheckRadioId,
} from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

export enum RflzFormComponentPresentation {
    Default,
    Onsite,
}

export interface RflzRadioFoundEvent {
    last4DigitsOfRadioId: string;
    usedCarBrandingType: string;
    offerTypeForProgramCode: string;
}
@Component({
    selector: 'rflz-form',
    templateUrl: './rflz-form.component.html',
    styleUrls: ['./rflz-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RflzFormComponent implements OnDestroy, OnInit, AfterViewInit, OnChanges {
    @Input() sweepstakesEligible = false;
    @Input() programCode: string;
    @Input() licensePlateLookupEnabled = true;
    @Input() nflOptInEnabled = false;
    @Input() set openLicensePlateModal(licensePlateOpened: boolean) {
        this._openLicensePlateModal = licensePlateOpened;
        if (this._licensePlateLookupModal) {
            if (this._openLicensePlateModal) {
                this._licensePlateLookupModal.open();
            } else {
                this._licensePlateLookupModal.close();
            }
        }
    }

    presentationEnum = RflzFormComponentPresentation;

    @Input() presentation: RflzFormComponentPresentation = RflzFormComponentPresentation.Default;
    @Input() hideErrorMessagePill: boolean = false;

    get openLicensePlateModal() {
        return this._openLicensePlateModal;
    }
    @Input() maskedRadioId: string;
    @Input() radioIdOrVin: string;

    @Output() foundRadio: EventEmitter<RflzRadioFoundEvent> = new EventEmitter<RflzRadioFoundEvent>();
    @Output() foundRadioError: EventEmitter<string> = new EventEmitter<string>();
    @Output() helpFindRadio = new EventEmitter();
    @Output() redirectError: EventEmitter<string> = new EventEmitter();

    @ViewChild('confirmVinModal') private _confirmVinModal: SxmUiModalComponent;
    @ViewChild('licensePlateLookupModal') private _licensePlateLookupModal: SxmUiModalComponent;
    @ViewChild('vinErrorModal') private _vinErrorModal: SxmUiModalComponent;
    confirmVinModalData: { last4DigitsOfRadioId: string; vinNumber: string; licensePlate: string; vehicleInfo: any; state: string };

    currentCountry: sxmCountries;
    currentLang: SxmLanguages;
    errorCode: string = null;
    errorMsgData: RflzErrorData = null;
    private readonly _destroy$ = new Subject();
    form: FormGroup;
    loading = false;
    submitted = false;
    isCanada = false;
    componentKey = 'rflzLookup';
    totalSteps = 3;
    error3494Counter = 0;
    isNFLOptIn = false;
    private _openLicensePlateModal: boolean = false;

    licensePlateLookupModalAriaDescribedbyTextId = uuid();
    confirmVinModalAriaDescribedbyTextId = uuid();
    vinErrorModalAriaDescribedbyTextId = uuid();


    constructor(
        private readonly _dataTrialService: DataTrialService,
        private readonly _fb: FormBuilder,
        private readonly _settingsService: SettingsService,
        private readonly _translate: TranslateService,
        private readonly _store: Store
    ) {}

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    ngOnInit(): void {
        this.currentCountry = this._settingsService.settings.country;
        this.currentLang = this._translate.currentLang as SxmLanguages;
        this.isCanada = this._settingsService.isCanadaMode;
        this._translate.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((response) => {
            this.currentLang = response.lang as SxmLanguages;
            this._updateFormValidation(this.currentLang);
        });

        if (this.programCode === 'SA3FOR2AARTC' || this.programCode === 'SA3FOR2PYP' || this.programCode === 'CASA3FOR2PYP') {
            this.totalSteps = 4;
        }
        this.form = this._fb.group({
            radioId: !!this.maskedRadioId
                ? ['****' + this.maskedRadioId, { validators: getSxmValidator('radioIdOrVin') }]
                : [this.radioIdOrVin || '', { validators: getSxmValidator('radioIdOrVin'), updateOn: 'blur' }],
            firstName: ['', { validators: getSxmValidator('firstNameForLookup', this.currentCountry, this.currentLang), updateOn: 'blur' }],
            lastName: ['', { validators: getSxmValidator('lastNameForLookup', this.currentCountry, this.currentLang), updateOn: 'blur' }],
            zipCode: ['', { validators: getSxmValidator('zipCodeForLookup', this.currentCountry, this.currentLang), updateOn: 'blur' }],
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        const change = simpleChanges['maskedRadioId'];
        if (change.currentValue) {
            this.form?.setControl('radioId', new FormControl('****' + this.maskedRadioId || '', { validators: getSxmValidator('radioIdOrVin') }));
        }
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AUTHENTICATE', componentKey: 'rflzLookup' }));
    }

    private _updateFormValidation(language: SxmLanguages): void {
        this.form.get('firstName').setValidators(getSxmValidator('firstNameForLookup', this.currentCountry, language));
        this.form.get('lastName').setValidators(getSxmValidator('lastNameForLookup', this.currentCountry, language));
        this.form.get('zipCode').setValidators(getSxmValidator('zipCodeForLookup', this.currentCountry, language));
        this.form.updateValueAndValidity();
    }

    private _onUsedCarEligibilityCheck(response: UsedCarTrialResponse) {
        this.loading = false;
        if (response.status === 'SUCCESS') {
            this._store.dispatch(behaviorEventReactionRflzLookupSuccess({ componentKey: this.componentKey }));
            const emitEvent: RflzRadioFoundEvent = {
                last4DigitsOfRadioId: response.last4DigitsOfRadioId,
                usedCarBrandingType: response.usedCarBrandingType,
                offerTypeForProgramCode: response.offerTypeForProgramCode,
            };
            this.foundRadio.emit(emitEvent);
            this.form.reset();
            Object.keys(this.form.controls).forEach((key) => {
                this.form.get(key).setErrors(null);
            });
            this.error3494Counter = 0;
        } else {
            this._store.dispatch(behaviorEventReactionRflzLookupFailure({ componentKey: this.componentKey }));
            this._handleError(response);
        }
    }

    private _handleError({ last4DigitsOfRadioId, errorCode }: { last4DigitsOfRadioId?: string; errorCode: string }): void {
        this.errorMsgData = {
            lastName: this.form.get('lastName').value,
            radioId: last4DigitsOfRadioId || radioLastFour(this.form.get('radioId').value),
        };
        errorCode === '3494' && this.error3494Counter++;
        if (this._shouldRedirect(errorCode) || this.error3494Counter === 3) {
            this.redirectError.emit(errorCode);
        } else {
            this.errorCode = errorCode;
        }

        this.foundRadioError.emit(errorCode);
    }

    private _shouldRedirect(errorCode: string): boolean {
        return errorCode === '103' || errorCode === '5035' || errorCode === '101' || errorCode === '109' || errorCode === '111' || errorCode === '112' || errorCode === '113';
    }

    submitForm(): void {
        this.loading = true;
        this.submitted = true;
        const dataTypeToValidate = radioOrVinType(this.form.get('radioId').value);

        if (this.form.valid) {
            const radioIdOrVIN = this.form.get('radioId').value.replace(/\s|\*/g, '');
            dataTypeToValidate === 'vin' ? this._store.dispatch(behaviorEventReactionRflzDeviceInfoVin({ vin: radioIdOrVIN })) : null;
            this._dataTrialService
                .usedCarEligibilityCheck({
                    firstName: this.form.get('firstName').value,
                    lastName: this.form.get('lastName').value,
                    zipCode: this.form.get('zipCode').value,
                    radioIdOrVIN: radioIdOrVIN,
                    optInForNFL: this.isNFLOptIn,
                    ...(!!this.programCode && { programCode: this.programCode }),
                })
                .subscribe(
                    (result) => {
                        if (result.status === 'FAILURE') {
                            if (dataTypeToValidate === 'vin') {
                                this._store.dispatch(behaviorEventReactionRflzDeviceInfoVin({ vin: radioIdOrVIN }));
                            } else {
                                this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckRadioId({ radioId: radioIdOrVIN }));
                            }
                        }
                        this._onUsedCarEligibilityCheck(result);
                    },
                    () => {
                        this.loading = false;
                        this.errorCode = '106';
                        this.foundRadioError.emit('106');
                    },
                    () => {
                        this.loading = false;
                    }
                );
        } else {
            const errors = [];
            if (this.form.get('radioId').errors) {
                errors.push(dataTypeToValidate === 'radioId' ? 'Auth - Missing or incomplete radio ID' : 'Auth - Missing or invalid VIN');
                if (this.isCanada && this.form.get('radioId').value) {
                    this.error3494Counter++;
                    if (this.error3494Counter === 3) {
                        this.redirectError.emit('3494');
                    }
                }
            }
            if (this.form.get('firstName').errors) {
                errors.push('Auth - Missing first name');
            }
            if (this.form.get('lastName').errors) {
                errors.push('Auth - Missing last name');
            }
            if (this.form.get('zipCode').errors) {
                errors.push('Auth - Missing or invalid zip code');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventReactionRflzFormClientSideValidationErrors({ errors }));
            }
            this.loading = false;
        }
    }

    handleSelectedLicensePlateVin(vinData) {
        this.confirmVinModalData = vinData;
        this._licensePlateLookupModal.close();
        this._confirmVinModal.open();
    }

    tryLicenseLookupAgain() {
        this._confirmVinModal.close();
        this._licensePlateLookupModal.open();
    }

    prefillVin(vinNumber: string) {
        const maskedVinNumber = '**********' + vinNumber.slice(-4);
        this.form.patchValue({ radioId: maskedVinNumber });
    }

    handleLicensePlateLookupError() {
        this._vinErrorModal.open();
        this._licensePlateLookupModal.close();
    }

    onVinConfirmed() {
        this._confirmVinModal.close();
        this.prefillVin(this.confirmVinModalData.vinNumber);
    }

    onVerifyAccountClick(value) {
        this.isNFLOptIn = value?.nflForOptIn;
    }
}
