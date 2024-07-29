import { Injectable } from '@angular/core';
import { getSecondarySubscriptions } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { UpdateVipSubscriptionPayload, UpdateVipSubscriptionService } from '../data-services/update-vip-subscription.service';
import { setSecondDeviceCredentialsStatus, setSecondDeviceExistingMaskedUsername } from '../state/actions';
import { DeviceCredentialsStatus } from '../state/models';
import { getAccountCurrentVipPlanCode, getSecondDevice } from '../state/selectors';

@Injectable({
    providedIn: 'root',
})
export class PurchaseVipForAddSecondRadioWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _updateVipSubscriptionService: UpdateVipSubscriptionService, private readonly _store: Store) {}

    build() {
        return this._store.select(getSecondDevice).pipe(
            withLatestFrom(this._store.select(getSecondarySubscriptions), this._store.select(getAccountCurrentVipPlanCode)),
            concatMap(([{ radioId, status }, subscriptions, planCode]) => {
                const params: UpdateVipSubscriptionPayload = {
                    plans: [
                        {
                            planCode,
                        },
                    ],
                    emailAddressChanged: false,
                    paymentInfo: {
                        useCardOnfile: true,
                    },
                };
                if (status === 'CLOSED') {
                    params.radioId = radioId;
                } else {
                    const selectedRadioSubscriptionId = subscriptions?.find((subscription) => {
                        const subscriptionRadioId = subscription.radioService?.last4DigitsOfRadioId;
                        return subscriptionRadioId.endsWith(radioId);
                    })?.id;
                    params.subscriptionId = selectedRadioSubscriptionId;
                }
                return this._updateVipSubscriptionService.updateSecondarySubscription(params);
            }),
            tap((data) => {
                this._store.dispatch(setSecondDeviceExistingMaskedUsername({ secondDeviceExistingMaskedUsername: data.maskedStreamingUserName }));
                this._store.dispatch(setSecondDeviceCredentialsStatus({ deviceCredentialsStatus: this._getDeviceCredentialsStatusAccordingResponse(data) }));
            }),
            mapTo(true),
            take(1)
        );
    }

    private _getDeviceCredentialsStatusAccordingResponse(data: { isEligibleForRegistration?: boolean; isEligibleForStreamingCredentialsOnly?: boolean }) {
        if (data.isEligibleForRegistration) {
            return DeviceCredentialsStatus.EligibleForRegistration;
        } else if (data.isEligibleForStreamingCredentialsOnly) {
            return DeviceCredentialsStatus.EligibleForStreamingCredentialsOnly;
        } else {
            return DeviceCredentialsStatus.AlreadyRegistered;
        }
    }
}
