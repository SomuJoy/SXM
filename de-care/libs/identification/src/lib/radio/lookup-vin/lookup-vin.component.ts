import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { NgModel } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import {
    DataDevicesService,
    RadioModel,
    AccountModel,
    ErrorTypeEnum,
    SubscriptionModel,
    DataIdentityRequestStoreService,
    IdentityRequestModel,
    DataLayerActionEnum,
    ComponentNameEnum,
} from '@de-care/data-services';
import { concatMap } from 'rxjs/operators';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum, SharedEventTrackService } from '@de-care/data-layer';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { Store } from '@ngrx/store';
import { behaviorEventReactionLookupAuthenticationFailure, behaviorEventReactionLookupByVinSuccess } from '@de-care/shared/state-behavior-events';

export interface LookupVinSelectedData {
    selectedRadio: RadioModel;
    selectedAccount: AccountModel;
}

@Component({
    selector: 'lookup-vin',
    templateUrl: './lookup-vin.component.html',
    styleUrls: ['./lookup-vin.component.scss'],
})
export class LookupVinComponent implements OnInit {
    @Input() set prefilledVin(value: string) {
        if (value) {
            this.vin = value;
            this.vinModel.control.updateValueAndValidity();
        }
    }
    @Output() selectedRadio = new EventEmitter<RadioModel>();
    @Output() selectedAccount = new EventEmitter<AccountModel>();
    @Output() selectedData = new EventEmitter<LookupVinSelectedData>();
    @Output() vinError = new EventEmitter<Error>();
    @Output() activeSubscriptionFound = new EventEmitter<SubscriptionModel>();
    @Output() noAccountFound = new EventEmitter<RadioModel>();

    @ViewChild('vinModel', { static: true }) vinModel: NgModel;

    vin: string;
    uniqueId: string = uuid();
    submitted: boolean = false;
    loading: boolean = false;
    accountNotSupportedError = false;
    @Input() isNFLOptInChecked = false;
    @Input() ariaDescribedbyTextId = uuid();

    constructor(
        private _dataDevicesService: DataDevicesService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _dataLayerSrv: DataLayerService,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _store: Store,
        private _eventTrackService: SharedEventTrackService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.vinModel.control.setValidators(getSxmValidator('vin'));
    }

    sendVin() {
        this.submitted = true;
        let radioHolder: RadioModel;
        this.accountNotSupportedError = false;
        if (this.vinModel.valid) {
            this.loading = true;
            const identityRequestData: IdentityRequestModel = { requestType: 'vin', vin: this.vin };
            this._identityRequestStoreService.setIdentityRequestData(identityRequestData);
            this._dataDevicesService
                .validate({ vin: this.vin, optInForNFL: this.isNFLOptInChecked }, false)
                .pipe(
                    concatMap((radio) => {
                        radioHolder = radio;
                        return this._nonPiiSrv.build({ radioId: radio.last4DigitsOfRadioId });
                    })
                )
                .subscribe(
                    (account) => {
                        this.selectedData.emit({
                            selectedAccount: account,
                            selectedRadio: radioHolder,
                        });
                        this._eventTrackService.track(DataLayerActionEnum.EnterVINSuccessful, { componentName: ComponentNameEnum.EnterVIN });
                        this._store.dispatch(behaviorEventReactionLookupByVinSuccess({ vin: this.vin }));
                        this.loading = false;
                    },
                    (error) => {
                        this.loading = false;
                        if (error.error.error.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                            this.accountNotSupportedError = true;
                            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentAccountNotSupported));
                            this._changeDetectorRef.markForCheck();
                        } else if (error.status === 400 && radioHolder) {
                            this._dataDevicesService.info({ radioId: radioHolder.last4DigitsOfRadioId }).subscribe((datadeviceInfo) => {
                                this.noAccountFound.emit({
                                    id: null,
                                    last4DigitsOfRadioId: radioHolder.last4DigitsOfRadioId,
                                    vehicleInfo: datadeviceInfo.deviceInformation.vehicle,
                                    is360LCapable: false,
                                });
                            });
                        } else {
                            this.vinError.emit(error);
                            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingVIN));
                        }
                        this._store.dispatch(behaviorEventReactionLookupAuthenticationFailure());
                    }
                );
        } else {
            if (this.vinModel.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingVIN));
            }
        }
    }
}
