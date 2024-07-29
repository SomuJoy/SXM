import { Injectable } from '@angular/core';
import { getPersonalInfoSummary, getSecondaryStreamingSubscriptions } from '@de-care/domains/account/state-account';
import { getOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { UpdateVipSubscriptionService } from '../data-services/update-vip-subscription.service';
import { setSecondDeviceCredentialsStatus, setSecondDeviceExistingMaskedUsername } from '../state/actions';
import { DeviceCredentialsStatus } from '../state/models';
import { getSelectedStreamingAccount } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class PurchaseVipForAddStreamingWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _updateVipSubscriptionService: UpdateVipSubscriptionService, private readonly _store: Store) {}

    build() {
        return combineLatest([
            this._store.select(getSelectedStreamingAccount),
            this._store.select(getPersonalInfoSummary),
            this._store.select(getOfferPlanCode),
            this._store.select(getSecondaryStreamingSubscriptions),
        ]).pipe(
            take(1),
            map(([selectedStreamingAccount, personalInfoSummary, planCode, secondaryStreamingSubscriptions]) => {
                let request: any = {};
                let isAddSubscription = !!selectedStreamingAccount.password;
                let selectedSubscription = secondaryStreamingSubscriptions.find((subscription) => subscription.streamingService.id === selectedStreamingAccount.id);
                if (isAddSubscription) {
                    request['streamingInfo'] = {
                        firstName: personalInfoSummary.firstName,
                        lastName: personalInfoSummary.lastName,
                        emailAddress: selectedStreamingAccount.userName,
                        login: selectedStreamingAccount.userName,
                        password: selectedStreamingAccount.password,
                    };
                    request['emailAddressChanged'] = false;
                } else {
                    request['streamingInfo'] = {
                        firstName: personalInfoSummary.firstName,
                        lastName: personalInfoSummary.lastName,
                    };
                    request['subscriptionId'] = selectedSubscription.id;
                    request['emailAddressChanged'] = false;
                }
                request['paymentInfo'] = {
                    useCardOnfile: true,
                };
                request['plans'] = [
                    {
                        planCode: planCode,
                    },
                ];
                return { request };
            }),
            concatMap(({ request }) => {
                return this._updateVipSubscriptionService.updateSecondarySubscription(request);
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
