import { Injectable } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    getAccountAccountNumber,
    getAccountServiceAddressState,
    getSecondaryStreamingSubscriptions,
    getSecondarySubscriptions,
    LoadAccountSecondarySubscriptionsFromVipTokenWorkflowService,
    LoadAccountSecondarySubscriptionsVipWorkflowService,
    LoadAccountWorkflowService,
} from '@de-care/domains/account/state-account';
import { setPageStartingProvince } from '@de-care/domains/customer/state-locale';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { setPlatinumPackageSubscriptionId, setSecondDevices, setStreamingAccounts } from '../state/actions';
import { DeviceStatus } from '../state/models';
import { setErrorCode } from '../state/public.actions';
import { getIsCanadaMode } from '../state/public.selectors';
import { getAccountPlatinumSubscription, inboundQueryParams } from '../state/selectors';

export type LoadAddSecondRadioDataWorkflowServiceErrors = 'DEFAULT' | 'ALREADY_HAVE_2_RADIOS' | 'INELIGIBLE_FOR_SECOND_RADIO';

@Injectable({
    providedIn: 'root',
})
export class LoadAddSecondRadioDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _store: Store,
        private readonly _loadAccountSecondarySubscriptionsVipWorkflowService: LoadAccountSecondarySubscriptionsVipWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAccountSecondarySubscriptionsFromVipTokenWorkflowService: LoadAccountSecondarySubscriptionsFromVipTokenWorkflowService
    ) {}

    build() {
        // TODO: Account param set here should be removed, since is going to be taken from session automatically
        return this._updateUsecaseWorkflowService.build({ useCase: 'PVIP', identifiedUser: true }).pipe(
            withLatestFrom(this._store.select(inboundQueryParams)),
            concatMap(([, { token }]) => {
                if (token) {
                    return this._loadAccountSecondarySubscriptionsFromVipTokenWorkflowService
                        .build(token)
                        .pipe(tap(({ nonPIIAccount }) => this._store.dispatch(setPlatinumPackageSubscriptionId({ subscriptionId: nonPIIAccount?.subscriptions?.[0]?.id }))));
                }
                return this._getAccountAndEligibleSubscriptionsFromSession();
            }),
            withLatestFrom(
                this._store.select(getSecondarySubscriptions),
                this._store.select(getSecondaryStreamingSubscriptions),
                this._store.select(getIsCanadaMode),
                this._store.select(getAccountServiceAddressState)
            ),
            tap(([, secondarySubscriptions, secondaryStreamingSubscriptions, isCanadaMode, province]) => {
                const radioService = secondarySubscriptions?.filter((sub) => sub?.radioService);
                const streamingAccounts = secondaryStreamingSubscriptions?.filter((sub) => sub?.streamingService);
                this._store.dispatch(
                    setStreamingAccounts({
                        streamingAccounts: streamingAccounts?.map((subscription) => {
                            const plan = subscription.plans?.[0];
                            return {
                                ...subscription.streamingService,
                                packageName: plan?.packageName,
                            };
                        }),
                    })
                );
                this._store.dispatch(
                    setSecondDevices({
                        secondDevices: radioService?.map((subscription) => {
                            const plan = subscription.plans?.[0];
                            return {
                                radioId: subscription.radioService.last4DigitsOfRadioId,
                                vehicle: subscription.radioService.vehicleInfo,
                                status: plan ? (plan.type.toUpperCase() as DeviceStatus) : 'CLOSED',
                                packageName: plan?.packageName,
                            };
                        }),
                    })
                );
                if (isCanadaMode) {
                    this._store.dispatch(setPageStartingProvince({ isDisabled: true, province }));
                }
                this._store.dispatch(pageDataFinishedLoading());
            }),
            catchError((errorResponse) => {
                const errorCode = errorResponse?.fieldErrors?.[0]?.errorCode || errorResponse?.errorCode;
                let workflowError: LoadAddSecondRadioDataWorkflowServiceErrors = 'DEFAULT';
                if (errorCode === 'SUBSCRIPTION_HAS_VIP_PLATINUM_PACKAGE_ON_2_RADIOS') {
                    workflowError = 'ALREADY_HAVE_2_RADIOS';
                } else if (errorCode === 'SUBSCRIPTION_NOT_ELIGIBLE_FOR_SECOND_RADIO') {
                    workflowError = 'INELIGIBLE_FOR_SECOND_RADIO';
                }
                this._store.dispatch(setErrorCode({ errorCode: workflowError }));
                return throwError(workflowError);
            }),
            mapTo(true),
            take(1)
        );
    }

    private _getAccountAndEligibleSubscriptionsFromSession() {
        return this._loadAccountWorkflowService.build({}).pipe(
            withLatestFrom(this._store.select(inboundQueryParams)),
            tap(([, { subscriptionId }]) => {
                this._store.dispatch(setPlatinumPackageSubscriptionId({ subscriptionId }));
            }),
            withLatestFrom(this._store.select(getAccountAccountNumber), this._store.select(getAccountPlatinumSubscription)),
            concatMap(([, accountNumber, currentSubscription]) =>
                this._loadAccountSecondarySubscriptionsVipWorkflowService.build({
                    radioId: currentSubscription?.radioService?.radioId,
                    accountNumber,
                })
            )
        );
    }
}
