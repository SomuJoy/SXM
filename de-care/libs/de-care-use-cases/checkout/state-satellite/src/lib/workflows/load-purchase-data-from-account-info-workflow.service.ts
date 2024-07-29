import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { getAccountSubscriptions, LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { catchError, concatMap, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedRadioId, setSelectedSubscriptionId } from '../state/actions';
import { ValidateDeviceByRadioIdWorkflowService } from '@de-care/domains/device/state-device-validate';

interface LoadPurchaseDataFromAccountInfoWorkflowRequest {
    accountNumber: string;
    radioId?: string;
    lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataFromAccountInfoWorkflowService implements DataWorkflow<LoadPurchaseDataFromAccountInfoWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceByRadioIdWorkflowService: ValidateDeviceByRadioIdWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow
    ) {}

    build({ accountNumber, radioId, lastName }: LoadPurchaseDataFromAccountInfoWorkflowRequest): Observable<boolean> {
        return this._validateDeviceByRadioIdWorkflowService.build(radioId).pipe(
            withLatestFrom(this._store.select(getPvtTime)),
            concatMap(([, pvtTime]) =>
                this._loadAccountFromAccountDataWorkflow.build({ pvtTime, radioId, ...(accountNumber ? { accountNumber } : {}), ...(lastName ? { lastName } : {}) }).pipe(
                    withLatestFrom(this._store.select(getAccountSubscriptions)),
                    tap(([, subscriptions]) => {
                        this._store.dispatch(setSelectedRadioId({ radioId }));
                        if (subscriptions.length > 0) {
                            const selectedSubscription = subscriptions.find((subscription) => {
                                const last4DigitsOfRadio = subscription.radioService?.last4DigitsOfRadioId;
                                if (last4DigitsOfRadio) {
                                    return radioId.endsWith(last4DigitsOfRadio);
                                }
                                return false;
                            });
                            const subscriptionId = selectedSubscription?.id;
                            if (subscriptionId) {
                                this._store.dispatch(setSelectedSubscriptionId({ subscriptionId }));
                            }
                        }
                    })
                )
            ),
            catchError((error) => {
                if (error?.url?.endsWith('device/validate')) {
                    return throwError('INVALID_DEVICE');
                }
                return throwError(error);
            }),
            mapTo(true)
        );
    }
}
