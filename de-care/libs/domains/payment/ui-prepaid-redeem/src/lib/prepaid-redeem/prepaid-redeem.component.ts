import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
import { DataPurchaseService, PrepaidRedeemRequest } from '@de-care/data-services';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/validation';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormBuilder, AbstractControl, FormGroup } from '@angular/forms';
import { SettingsService } from '@de-care/settings';
import * as uuid from 'uuid/v4';

export interface AddedGiftCardData {
    amount: number;
    pin: string;
}
@Component({
    selector: 'prepaid-redeem-ui',
    templateUrl: './prepaid-redeem.component.html',
    styleUrls: ['./prepaid-redeem.component.scss'],
})
export class PrepaidRedeemComponent implements OnInit {
    @Input() initialState = null;
    @Output() cardSubmitted = new EventEmitter<AddedGiftCardData>();
    @Output() cardCleared = new EventEmitter();

    translateKey = 'domainsPaymentUiPrepaidRedeemModule.prepaidRedeemComponent.';
    months: any;
    years: any;
    todaysDate: any;
    formExpand = false;
    redeemSuccess = false;
    trackRedeemOpenAction = 'prepaid-opened';
    trackSubmitAction = 'prepaid-redeemed';
    trackComponentName = 'prepaid-redeem';
    redeemSuccessEmitter$ = new BehaviorSubject<boolean>(this.redeemSuccess);
    prepaidForm: FormGroup;
    isBlackHawk: boolean;
    isCanada: boolean;
    blackHwkRegex = new RegExp(/^443613/);
    submitted = false;
    prepaidRedeemedId: string;
    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    private readonly _logPrefix = '[Gift Card]:';

    constructor(
        private readonly _eventTrackingService: SharedEventTrackService,
        private readonly _logger: CoreLoggerService,
        private readonly _purchaseService: DataPurchaseService,
        private readonly _formBuilder: FormBuilder,
        private readonly _settingsSrv: SettingsService
    ) {
        this.prepaidRedeemedId = `prepaidRedeemed_${uuid()}`;
        const date = new Date();
        this.todaysDate = {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        };
        this.years = Array.from(new Array(11), (x, i) => i + this.todaysDate.year);
        this.months = Array.from(new Array(12), (x, i) => i + 1);
        this.prepaidForm = this._formBuilder.group(
            {
                pinNumber: new FormControl('', getSxmValidator('pinNumber')),
                gcExpM: new FormControl(),
                gcExpY: new FormControl(),
                gcCVV: new FormControl(),
            },
            { validator: this.gcExpValidator }
        );
    }

    ngOnInit() {
        this._logger.debug(`${this._logPrefix} Component running `);
        this.prepaidForm.get('pinNumber').valueChanges.subscribe((selectedValue) => {});
        this.isCanada = this._settingsSrv.isCanadaMode;
        this.restoreAcceptedGiftCardInitialState();
    }

    get f() {
        // Getter for easy access to form fields
        return this.prepaidForm.controls;
    }

    restoreAcceptedGiftCardInitialState() {
        if (this.initialState) {
            this.redeemSuccess = true;
            this.formExpand = true;
            this.redeemSuccessEmitter$.next(this.redeemSuccess);
        }
    }

    submitPrepaid() {
        this.submitted = true;
        this._checkBlackHawk();

        const PrepaidCardRedeemRequest: PrepaidRedeemRequest = {
            giftCardNumber: this.prepaidForm.value.pinNumber,
            giftCardExpMonth: this.prepaidForm.value.gcExpM,
            giftCardExpYear: this.prepaidForm.value.gcExpY,
            securityCode: this.prepaidForm.value.gcCVV,
        };

        this._purchaseService.redeemPrepaidCard(PrepaidCardRedeemRequest).subscribe(
            (data) => {
                if (data.isSuccess) {
                    if (data.amount > 0) {
                        this.cardSubmitted.emit({ pin: this.prepaidForm.value.pinNumber, amount: data.amount });
                        this.redeemSuccess = true;
                        this.formExpand = true;
                    } else {
                        //invalid pin
                        this.redeemSuccess = null;
                    }
                    //this is needed because otherwise the redeemSuccess change does not update view until triggered by another action
                    this.redeemSuccessEmitter$.next(this.redeemSuccess);
                } else {
                    this.redeemSuccess = null;
                    this.redeemSuccessEmitter$.next(this.redeemSuccess);
                }
            },
            (error) => {
                this.redeemSuccess = null;
            }
        );
        this._eventTrackingService.track(this.trackSubmitAction, { componentName: this.trackComponentName, inputData: this.prepaidForm.value.pinNumber });
    }

    private _checkBlackHawk(): void {
        if (this.isBlackHawk) {
            this.setBlackHawkFieldValidators();
            if (!this.controlIsInvalid(this.f['gcExpM']) && this.prepaidForm.value.gcExpM < 9) {
                this.prepaidForm.value.gcExpM = '0' + this.prepaidForm.value.gcExpM;
            }
        }
    }

    resetPrepaid() {
        this.prepaidForm.value.pinNumber = undefined;
        this.formExpand = false;
        this.removePrepaid();
        this.redeemSuccess = false;
    }

    resetBlackHwkFields() {
        this.prepaidForm.value.gcExpM = undefined;
        this.prepaidForm.value.gcExpY = undefined;
        this.prepaidForm.value.gcCVV = undefined;
        this.submitted = false;
    }

    prepaidBlur() {
        if (this.redeemSuccess === null && !this.prepaidForm.value.pinNumber) {
            this.removePrepaid();
            this.redeemSuccess = undefined;
        }
    }

    togglePrepaid() {
        this.removeBlackHawkFieldValidators();
        this.checkBlkHwkPttrn();
        this.prepaidForm.reset();
        if (this.redeemSuccess) {
            this.removePrepaid();
            this.formExpand = false;
        } else {
            this.formExpand = !this.formExpand;
            this.prepaidForm.value.pinNumber = undefined;
            this.autoFillInitialState();

            if (this.formExpand) {
                this._eventTrackingService.track(this.trackRedeemOpenAction, { componentName: this.trackComponentName });
            }
        }
        this.redeemSuccess = false;
    }

    private autoFillInitialState() {
        if (this.initialState) {
            this.prepaidForm.get('pinNumber').setValue(this.initialState);
        }
    }

    private removePrepaid() {
        this._purchaseService.removePrepaidCard().subscribe((data) => {
            if (data === 'SUCCESS') {
                this.cardCleared.emit();
                this.redeemSuccessEmitter$.next(this.redeemSuccess);
            }
        });
    }
    checkBlkHwkPttrn() {
        this.isBlackHawk = this.blackHwkRegex.test(this.prepaidForm.value.pinNumber);
    }

    gcExpValidator = (control: AbstractControl) => {
        // Custom GC exp check validator
        if (control.value.gcExpY === this.todaysDate.year && control.value.gcExpM < this.todaysDate.month) {
            return { validDate: true };
        }
        return null;
    };
    setBlackHawkFieldValidators() {
        this.f['gcExpM'].setValidators(getSxmValidator('gcExpM'));
        this.f['gcExpY'].setValidators(getSxmValidator('gcExpY'));
        this.f['gcCVV'].setValidators(getSxmValidator('gcCVV'));
        this.f['gcExpM'].updateValueAndValidity();
        this.f['gcExpY'].updateValueAndValidity();
        this.f['gcCVV'].updateValueAndValidity();
    }
    removeBlackHawkFieldValidators() {
        this.f['gcExpM'].clearValidators();
        this.f['gcExpY'].clearValidators();
        this.f['gcCVV'].clearValidators();
        this.f['gcExpM'].updateValueAndValidity();
        this.f['gcExpY'].updateValueAndValidity();
        this.f['gcCVV'].updateValueAndValidity();
    }

    clearForm() {
        this.prepaidForm.reset();
        this.formExpand = false;

        if (this.redeemSuccess) {
            this.removePrepaid();
        }
        this.redeemSuccess = false;
    }
}
