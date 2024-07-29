import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataLayerService } from '@de-care/data-layer';
import { AccountModel, BusinessErrorModel, DataLayerDataTypeEnum, getFirstSubscriptionOrClosedDeviceStatus, PackageModel, SweepstakesModel } from '@de-care/data-services';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AccountData } from '../../page-parts/new-account-form-step/new-account-form-step.component';
import { ActivationFlowtype, TrialActivationService } from '../../processing/trial-activation.service';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { setSubscriptionsFromLegacyOneStepActivation, Subscription, Account } from '@de-care/domains/account/state-account';
import { Store } from '@ngrx/store';

@Injectable()
export class OneStepActivationFlowService {
    constructor(
        private _trialActivationService: TrialActivationService,
        private _dataLayerService: DataLayerService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _store: Store
    ) {}

    activateNewAccount(accountData: AccountData, radioId: string, offer: PackageModel, lang: string, sweepstakesInfo?: SweepstakesModel): Observable<Account> {
        return this._trialActivationService.activateNewAccount(accountData, radioId, offer, lang, sweepstakesInfo, ActivationFlowtype.oneStepActivation).pipe(
            tap((res) => {
                if (res?.subscriptions) {
                    this._store.dispatch(setSubscriptionsFromLegacyOneStepActivation({ subscriptions: res?.subscriptions as any[] as Subscription[] }));
                }
            })
        );
    }

    initializeDataLayer(radioId: string) {
        this._nonPiiSrv
            .build({ radioId })
            .pipe(
                map((result: AccountModel) => {
                    return getFirstSubscriptionOrClosedDeviceStatus(result, radioId);
                }),
                catchError((err: HttpErrorResponse) => {
                    if (err.error && err.error.error && err.error.error.fieldErrors) {
                        const fldErrorZero: BusinessErrorModel = err.error.error.fieldErrors[0];
                        if (fldErrorZero.errorCode === 'DEVICE_NOT_IN_USE') {
                            this._updateDataLayerStatus('Closed');
                        }
                    }
                    return EMPTY;
                })
            )
            .subscribe((radioStatus) => this._updateDataLayerStatus(radioStatus));
    }

    private _updateDataLayerStatus(deviceStatus: string): void {
        const deviceInfoObj: any = this._dataLayerService.getData(DataLayerDataTypeEnum.DeviceInfo) || {};
        deviceInfoObj.status = deviceStatus;
        this._dataLayerService.update(DataLayerDataTypeEnum.DeviceInfo, deviceInfoObj);
    }
}
