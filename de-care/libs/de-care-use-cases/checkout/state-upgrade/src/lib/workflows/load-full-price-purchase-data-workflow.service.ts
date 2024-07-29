import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { CollectInboundQueryParamsWorkflowService, initTransactionId, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getAccountSubscriptions, getClosedDevicesFromAccount, LoadAccountFromPKGTokenWorkflowService } from '@de-care/domains/account/state-account';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getAccountRequestData, getAllowedQueryParamsExist, getOfferRequestData } from '../state/selectors';
import { setSelectedRadioId, setSelectedSubscriptionId } from '../state/actions';
import { getConfiguredLeadOfferOrFirstOfferPlanCode, getFirstOfferIsFallback } from '@de-care/domains/offers/state-offers';

export type LoadFullPricePurchaseDataWorkflowServiceErrors = 'SYSTEM' | 'MISSING_PROGRAM_CODE' | 'ALREADY_UPGRADED';

@Injectable({ providedIn: 'root' })
export class LoadFullPricePurchaseDataWorkflowService implements DataWorkflow<void, boolean> {
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
                throw new Error('MISSING_PROGRAM_CODE' as LoadFullPricePurchaseDataWorkflowServiceErrors);
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
            return throwError('SYSTEM' as LoadFullPricePurchaseDataWorkflowServiceErrors);
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
            const fieldError = errorResponse?.error?.error?.fieldErrors ? errorResponse?.fieldErrors[0] : errorResponse?.error?.error;
            switch (fieldError?.errorCode) {
                case 'ALREADY_UPGRADED':
                    return throwError('ALREADY_UPGRADED' as LoadFullPricePurchaseDataWorkflowServiceErrors);
                default:
                    return throwError('SYSTEM' as LoadFullPricePurchaseDataWorkflowServiceErrors);
            }
        })
    );

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'fullpriceupgrade' }));
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
