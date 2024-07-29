import { LoadQuoteReactivationWorkflowService } from '@de-care/domains/quotes/state-quote';
import { Injectable } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take, tap } from 'rxjs/operators';
import { initTransactionId, captureBillingStatus } from '../state/actions';
import { loadNextBestActionsAsync } from '@de-care/domains/account/state-next-best-actions';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';

export type LoadSubmitPaymentWorkflowErrors = 'SYSTEM';
@Injectable({ providedIn: 'root' })
export class LoadSubmitPaymentWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _loadQuoteReactivationWorkflowService: LoadQuoteReactivationWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            concatMap(() => this._updateUsecaseWorkflowService.build({ useCase: 'MAKE_PAYMENT' })),
            concatMap(() => {
                return this._store.select(getNormalizedQueryParams).pipe(
                    take(1),
                    concatMap((params) => {
                        const accountRequest = params?.accountnumber
                            ? { accountNumber: params.accountnumber, includeFuturePaymentInfo: true }
                            : { includeFuturePaymentInfo: true };
                        return this._loadAccountWorkflowService.build(accountRequest).pipe(
                            tap((account) => {
                                this._store.dispatch(loadNextBestActionsAsync());
                                this._store.dispatch(captureBillingStatus({ billingSummary: account?.billingSummary, subscriptions: account?.subscriptions }));
                            }),
                            concatMap(() => this._loadQuoteReactivationWorkflowService.build()),
                            mapTo(true),
                            tap(() => {
                                this._store.dispatch(initTransactionId());
                                this._store.dispatch(pageDataFinishedLoading());
                            }),
                            catchError((error) => this._errorHandler(error))
                        );
                    })
                );
            })
        );
    }

    private _errorHandler(error) {
        //TODO: Additional error hanlder logic
        return throwError(error);
    }
}
