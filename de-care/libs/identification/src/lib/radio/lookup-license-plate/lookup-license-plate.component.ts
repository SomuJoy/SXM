import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/validation';
import {
    DataIdentityService,
    DataDevicesService,
    AccountModel,
    DataAccountService,
    SubscriptionModel,
    ErrorTypeEnum,
    DataIdentityRequestStoreService,
    IdentityRequestModel,
    RadioModel,
    DataLayerActionEnum,
    ComponentNameEnum,
    VehicleModel,
} from '@de-care/data-services';
import { concatMap } from 'rxjs/operators';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum, SharedEventTrackService } from '@de-care/data-layer';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { behaviorEventReactionLookupAuthenticationFailure, behaviorEventReactionLookupByLicensePlateSuccess } from '@de-care/shared/state-behavior-events';

export interface LookupLicensePlateSelectedVin {
    vinNumber: string;
    state: string;
    licensePlate: string;
    vehicleInfo?: VehicleModel;
    last4DigitsOfRadioId?: string;
    account: AccountModel;
}
@Component({
    selector: 'lookup-license-plate',
    templateUrl: './lookup-license-plate.component.html',
    styleUrls: ['./lookup-license-plate.component.scss'],
})
export class LookupLicensePlateComponent implements OnInit {
    @Output() selectedVin = new EventEmitter<LookupLicensePlateSelectedVin>();
    @Output() licensePlateError = new EventEmitter<Error>();
    @Output() activeSubscriptionFound = new EventEmitter<SubscriptionModel>();
    @Output() noAccountFound = new EventEmitter<any>();
    submitted: boolean = false;
    loading: boolean = false;
    uniqueId1: string = uuid();
    uniqueId2: string = uuid();
    uniqueId3: string = uuid();
    accountNotSupportedError = false;
    licencePlateForm: FormGroup;
    @Input() isNFLOptInChecked = false;
    @Input() ariaDescribedbyTextId = uuid();

    get fControls(): {
        [key: string]: AbstractControl;
    } {
        return this.licencePlateForm.controls;
    }

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(
        private _formBuilder: FormBuilder,
        private _dataIdentity: DataIdentityService,
        private _dataLayerSrv: DataLayerService,
        private _dataDevices: DataDevicesService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _store: Store,
        private _eventTrackService: SharedEventTrackService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.licencePlateForm = this._formBuilder.group({
            licensePlate: this._formBuilder.control('', {
                validators: getSxmValidator('licencePlateNumber'),
                updateOn: 'blur',
            }),
            state: [null, getSxmValidator('creditCardState')],
            agreement: [false, getSxmValidator('agreement')],
        });
    }

    submit() {
        this.submitted = true;
        this.accountNotSupportedError = false;
        if (this.licencePlateForm.valid) {
            this.loading = true;
            const formValue = this.licencePlateForm.value;
            const identityRequestData: IdentityRequestModel = { requestType: 'licensePlate', licencePlateInfo: formValue };
            this._identityRequestStoreService.setIdentityRequestData(identityRequestData);
            let last4DigitsOfVin: string;
            const trimmedLicensePlateString = formValue.licensePlate.trim();
            let radioHolder: RadioModel;
            this._dataIdentity
                .deviceLicencePlate({
                    licensePlate: trimmedLicensePlateString,
                    state: formValue.state,
                })
                .pipe(
                    concatMap((data) => {
                        last4DigitsOfVin = data.last4DigitsOfVin;
                        return this._dataDevices.validate({
                            vin: last4DigitsOfVin,
                            optInForNFL: this.isNFLOptInChecked,
                        });
                    }),
                    concatMap((radio) => {
                        radioHolder = radio;
                        return this._nonPiiSrv.build({ radioId: radio.last4DigitsOfRadioId });
                    })
                )
                .subscribe(
                    (account) => {
                        const subscription = account.subscriptions && account.subscriptions.length > 0 ? account.subscriptions[0] : null;
                        const closedDevice = account.closedDevices && account.closedDevices.length > 0 ? account.closedDevices[0] : null;
                        const vehicleInfo = closedDevice ? closedDevice.vehicleInfo : null || subscription?.radioService?.vehicleInfo;
                        const last4DigitsOfRadioId = closedDevice ? closedDevice.last4DigitsOfRadioId : null || subscription?.radioService?.last4DigitsOfRadioId;
                        this.selectedVin.emit({
                            vinNumber: last4DigitsOfVin,
                            state: formValue.state,
                            licensePlate: trimmedLicensePlateString,
                            last4DigitsOfRadioId,
                            vehicleInfo,
                            account,
                        });
                        this._eventTrackService.track(DataLayerActionEnum.EnterLicensePlateSuccessful, { componentName: ComponentNameEnum.EnterLicensePlate });
                        this._store.dispatch(behaviorEventReactionLookupByLicensePlateSuccess());
                        this.loading = false;
                    },
                    (error) => {
                        this.loading = false;
                        if (error.error.error.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                            this.accountNotSupportedError = true;
                            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentAccountNotSupported));
                            this._changeDetectorRef.markForCheck();
                        } else if (error.status === 400 && radioHolder) {
                            this._dataDevices.info({ radioId: radioHolder.last4DigitsOfRadioId }).subscribe((datadeviceInfo) => {
                                this.noAccountFound.emit({
                                    id: null,
                                    last4DigitsOfRadioId: radioHolder.last4DigitsOfRadioId,
                                    vehicleInfo: datadeviceInfo?.deviceInformation?.vehicle,
                                    vinNumber: datadeviceInfo?.deviceInformation?.vehicle?.vin?.slice(-4),
                                    state: formValue.state,
                                    licensePlate: trimmedLicensePlateString,
                                    account: [],
                                    is360LCapable: false,
                                });
                                this._store.dispatch(behaviorEventReactionLookupByLicensePlateSuccess());
                            });
                        } else {
                            this.licensePlateError.emit(error);
                            this.loading = false;
                        }

                        error.status === 500 &&
                            this._dataLayerSrv.buildErrorInfo(
                                new HttpErrorResponse({
                                    error: error.error,
                                    headers: error.headers,
                                    status: error.status,
                                    statusText: error.error.httpStatus,
                                    url: error.url,
                                })
                            );
                        this._store.dispatch(behaviorEventReactionLookupAuthenticationFailure());
                    }
                );
        } else {
            if (this.fControls.licensePlate.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingLicense));
            }
            if (this.fControls.state.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingState));
            }
            if (this.fControls.agreement.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingVINAgreement));
            }
        }
    }
}
