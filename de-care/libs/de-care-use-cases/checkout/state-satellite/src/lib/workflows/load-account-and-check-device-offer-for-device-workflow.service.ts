import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { getAccountSubscriptions, LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { getConfiguredLeadOfferOrFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { setSelectedRadioId, setSelectedSubscriptionId } from '../state/actions';
import { getOfferRequestData } from '../state/selectors';

export type LoadAccountAndCheckDeviceOfferForDeviceWorkflowServiceErrors = 'SYSTEM' | 'DIFFERENT_PLATFORM';

@Injectable({ providedIn: 'root' })
export class LoadAccountAndCheckDeviceOfferForDeviceWorkflowService implements DataWorkflow<{ accountNumber: string; radioId: string }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    private _loadOffers$ = this._store.select(getOfferRequestData).pipe(
        take(1),
        concatMap(({ programCode, radioId }) => this._loadCustomerOffersWithCmsContent.build({ ...(programCode ? { programCode } : {}), radioId, streaming: false })),
        // TODO: determine if we have a different platform issue here
        withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode)),
        tap(([, planCode]) => {
            this._store.dispatch(setSelectedPlanCode({ planCode }));
        }),
        mapTo(true)
    );

    build({ accountNumber, radioId }): Observable<boolean> {
        // TODO: this is the same as most of LoadPurchaseDataFromAccountInfoWorkflowService with the exception of the fact that we don't need the device validate call here
        //       so we should look to consolidate this code.
        return this._store.select(getPvtTime).pipe(
            take(1),
            concatMap((pvtTime) =>
                this._loadAccountFromAccountDataWorkflow.build({ pvtTime, radioId, ...(accountNumber ? { accountNumber } : {}) }).pipe(
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
            concatMap(() => this._loadOffers$),
            catchError(() => throwError('SYSTEM' as LoadAccountAndCheckDeviceOfferForDeviceWorkflowServiceErrors)),
            mapTo(true)
        );
    }
}
