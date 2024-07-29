import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { CollectInboundQueryParamsWorkflowService, initTransactionId, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getAccountSubscriptions, getClosedDevicesFromAccount, LoadAccountFromPKGTokenWorkflowService } from '@de-care/domains/account/state-account';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getConfiguredLeadOfferOrFirstOfferPlanCode, getFirstOfferIsFallback } from '@de-care/domains/offers/state-offers';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { setSelectedRadioId, setSelectedSubscriptionId } from '../state/actions';
import { getAccountRequestData, getAllowedQueryParamsExist, getOfferRequestData } from '../state/selectors';

export type LoadTierUpPurchaseDataWorkflowServiceErrors =
    | 'SYSTEM'
    | 'MISSING_PROGRAM_CODE'
    | 'OFFER_EXPIRED'
    | 'OFFER_ALREADY_REDEEMED'
    | 'TOKEN_NOT_ELIGIBLE'
    | 'DATA_NOT_FOUND';

@Injectable({ providedIn: 'root' })
export class LoadTierUpPurchaseDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadAccountFromPKGTokenWorkflowService: LoadAccountFromPKGTokenWorkflowService,
        private readonly _loadOffersCustomerWorkflowService: LoadCustomerOffersWithCmsContent
    ) {}

    private _checkForAllowedEntry$ = this._store.select(getAllowedQueryParamsExist).pipe(
        take(1),
        map((allowedQueryParamsExist) => {
            if (allowedQueryParamsExist) {
                return true;
            } else {
                throw 'MISSING_PROGRAM_CODE' as LoadTierUpPurchaseDataWorkflowServiceErrors;
            }
        })
    );

    private _loadAccount$ = this._store.select(getAccountRequestData).pipe(
        take(1),
        concatMap(({ token }) => this._loadAccountFromPKGTokenWorkflowService.build({ token, allowErrorHandler: false })),
        withLatestFrom(this._store.select(getAccountSubscriptions), this._store.select(getClosedDevicesFromAccount)),
        tap(([, subscriptions, closedDevices]) => {
            const subscription = subscriptions[0];
            if (subscription) {
                const radioId = subscription.radioService?.last4DigitsOfRadioId;
                this._store.dispatch(setSelectedRadioId({ radioId }));
                this._store.dispatch(setSelectedSubscriptionId({ subscriptionId: +subscription.id }));
            } else {
                const closedDevice = closedDevices[0];
                this._store.dispatch(setSelectedRadioId({ radioId: closedDevice.last4DigitsOfRadioId }));
            }
            // TODO: set starting province if needed
        }),
        catchError((errorResponse) => {
            const fieldError = errorResponse?.fieldErrors ? errorResponse?.fieldErrors[0] : errorResponse;
            switch (fieldError?.errorCode) {
                case 'TOKEN_REDEEMED':
                    return throwError('OFFER_ALREADY_REDEEMED' as LoadTierUpPurchaseDataWorkflowServiceErrors);
                case 'TOKEN_EXPIRED':
                    return throwError('OFFER_EXPIRED' as LoadTierUpPurchaseDataWorkflowServiceErrors);
                default:
                    return throwError('SYSTEM' as LoadTierUpPurchaseDataWorkflowServiceErrors);
            }
        }),
        mapTo(true)
    );

    private _loadOffers$ = this._store.select(getOfferRequestData).pipe(
        take(1),
        concatMap(({ programCode, radioId, province }) =>
            this._loadOffersCustomerWorkflowService.build({ streaming: false, student: false, programCode, radioId, ...(province && { province }) })
        ),
        withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode), this._store.pipe(select(getFirstOfferIsFallback))),
        map(([, planCode, offerIsFallback]) => {
            if (offerIsFallback) {
                throw new Error('Offer not available!');
            }
            this._store.dispatch(setSelectedPlanCode({ planCode }));
            return true;
        }),
        catchError((errorResponse) => {
            const fieldError = errorResponse?.fieldErrors ? errorResponse?.fieldErrors[0] : errorResponse;
            switch (fieldError?.errorCode) {
                case 'EXPIRED':
                    return throwError('OFFER_EXPIRED' as LoadTierUpPurchaseDataWorkflowServiceErrors);
                default:
                    return throwError('SYSTEM' as LoadTierUpPurchaseDataWorkflowServiceErrors);
            }
        })
    );

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'tierup' }));
        return this._collectInboundQueryParamsWorkflowService.build().pipe(
            concatMap(() => this._checkForAllowedEntry$),
            concatMap(() => this._loadAccount$),
            concatMap(() => this._loadOffers$),
            tap(() => {
                this._store.dispatch(initTransactionId());
                this._store.dispatch(pageDataFinishedLoading());
            })
        );
    }
}
