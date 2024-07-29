import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import * as uuid from 'uuid/v4';
import { NgModel } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import {
    DataDevicesService,
    RadioModel,
    AccountModel,
    ErrorTypeEnum,
    DataIdentityRequestStoreService,
    IdentityRequestModel,
    DataLayerActionEnum,
    ComponentNameEnum,
} from '@de-care/data-services';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum, SharedEventTrackService } from '@de-care/data-layer';
import { RadioIdLookupService } from '../../radio-id-lookup.service';
import { Store } from '@ngrx/store';
import {
    behaviorEventReactionLookupAuthenticationFailure,
    behaviorEventReactionLookupByRadioIdSuccess,
    behaviorEventReactionDevicePromoCode,
    behaviorEventReactionDeviceInfo,
} from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';

export interface LookupRadioIdSelectedData {
    selectedRadio: RadioModel;
    selectedAccount: AccountModel;
}
@Component({
    selector: 'lookup-radio-id',
    templateUrl: './lookup-radio-id.component.html',
    styleUrls: ['./lookup-radio-id.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LookupRadioIdComponent implements OnInit {
    @Output() noAccountFound = new EventEmitter<RadioModel>();
    @Output() deviceHelp = new EventEmitter();
    @Output() licensePlateHelp = new EventEmitter();
    @Output() selectedData = new EventEmitter<LookupRadioIdSelectedData>();
    @ViewChild('radioModel', { static: true }) radioModel: NgModel;
    @Input() showSearchByLicensePlateLink: boolean = false;
    @Input() set prefilledRadioId(value: string) {
        if (value) {
            this.radioId = value;
            this.radioModel.control.updateValueAndValidity();
        }
    }
    radioId: string;
    uniqueId: string = uuid();
    submitted: boolean = false;
    loading: boolean = false;
    radioIdLookupError = false;
    accountNotSupportedError = false;
    @Input() isNFLOptInChecked = false;
    @Input() ariaDescribedbyTextId = uuid();

    constructor(
        private _dataDevicesService: DataDevicesService,
        private _dataLayerSrv: DataLayerService,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _radioIdLookupService: RadioIdLookupService,
        private _eventTrackService: SharedEventTrackService,
        private _store: Store
    ) {}

    ngOnInit() {
        this.radioModel.control.setValidators(getSxmValidator('radioId'));
    }

    submit() {
        this.submitted = true;
        this.radioIdLookupError = false;
        this.accountNotSupportedError = false;
        if (this.radioModel.valid) {
            this.loading = true;
            const identityRequestData: IdentityRequestModel = { requestType: 'radioId', radioId: this.radioId };
            this._identityRequestStoreService.setIdentityRequestData(identityRequestData);
            const last4DigitsOfRadioId: string = this.radioId.substring(this.radioId.length - 4);
            this._radioIdLookupService.lookupAccountByRadioIdForNFL(this.radioId, this.isNFLOptInChecked).subscribe(
                ({ account, radio }) => {
                    this.selectedData.emit({
                        selectedRadio: radio,
                        selectedAccount: account,
                    });
                    this._eventTrackService.track(DataLayerActionEnum.EnterRadioIDSuccessful, { componentName: ComponentNameEnum.EnterRID });
                    this.loading = false;
                    this._store.dispatch(behaviorEventReactionLookupByRadioIdSuccess());
                },
                (error) => {
                    this.loading = false;
                    if (error.status === 400 && error.radioLookUpErrorType === 'radioCallError') {
                        this._dataDevicesService
                            .info({ radioId: last4DigitsOfRadioId })
                            .pipe(
                                tap((data) =>
                                    // TODO: Behavior action dispatched from legacy code. The call to device/info service is not using domain workflow. Needs to be refactored.
                                    {
                                        const deviceInfo = data?.deviceInformation;
                                        if (deviceInfo) {
                                            this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode: deviceInfo.promoCode }));
                                            this._store.dispatch(
                                                behaviorEventReactionDeviceInfo({
                                                    esn: last4DigitsOfRadioId,
                                                    vehicleInfo: {
                                                        year: deviceInfo.vehicle?.year as string,
                                                        make: deviceInfo.vehicle?.make,
                                                        model: deviceInfo.vehicle?.model,
                                                    },
                                                })
                                            );
                                        }
                                    }
                                )
                            )
                            .subscribe((datadeviceInfo) => {
                                this.noAccountFound.emit({
                                    id: null,
                                    last4DigitsOfRadioId: last4DigitsOfRadioId,
                                    vehicleInfo: datadeviceInfo.deviceInformation.vehicle,
                                    is360LCapable: false,
                                });
                            });
                    } else {
                        this.radioIdLookupError = true;
                        this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingRadioId));
                        this._changeDetectorRef.markForCheck();
                    }
                    this._store.dispatch(behaviorEventReactionLookupAuthenticationFailure());
                }
            );
        } else {
            if (this.radioModel.errors) {
                this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.IdentMissingRadioId));
            }
        }
    }
}
