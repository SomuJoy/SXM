import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getAccountSubscriptions, getClosedDevicesFromAccount, LoadAccountFromTokenWorkflowService } from '@de-care/domains/account/state-account';
import { mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedRadioId, setSelectedSubscriptionId } from '../state/actions';

interface LoadPurchaseDataFromTokenWorkflowRequest {
    token: string;
    tokenType?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataFromTokenWorkflowService implements DataWorkflow<LoadPurchaseDataFromTokenWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _loadAccountFromTokenWorkflowService: LoadAccountFromTokenWorkflowService) {}

    build({ token, tokenType }: LoadPurchaseDataFromTokenWorkflowRequest): Observable<boolean> {
        return this._loadAccountFromTokenWorkflowService.build({ token, isStreaming: false, student: false, allowErrorHandler: false, tokenType }).pipe(
            withLatestFrom(this._store.select(getAccountSubscriptions), this._store.select(getClosedDevicesFromAccount)),
            tap(([, subscriptions, closedDevices]) => {
                const subscription = subscriptions[0];
                if (subscription) {
                    const radioId = subscription.radioService?.last4DigitsOfRadioId;
                    this._store.dispatch(setSelectedRadioId({ radioId }));
                    this._store.dispatch(setSelectedSubscriptionId({ subscriptionId: subscription.id }));
                } else {
                    const closedDevice = closedDevices[0];
                    this._store.dispatch(setSelectedRadioId({ radioId: closedDevice.last4DigitsOfRadioId }));
                }
            }),
            mapTo(true)
        );
    }
}
