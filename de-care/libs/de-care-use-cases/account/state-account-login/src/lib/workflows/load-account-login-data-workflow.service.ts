import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { catchError, concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { collectAllInboundQueryParams, setUsernameToPrefill } from '../state/actions';
import { getTokenFromInboundQueryParams } from '../state/selectors';
import { LoadAccountFromTokenUsernameWorkflowService } from '@de-care/domains/account/state-account';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadAccountLoginDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private _loadAccountFromTokenUsernameWorkflowService: LoadAccountFromTokenUsernameWorkflowService) {}

    collectInboundQueryParams$ = this._store.select(getNormalizedQueryParams).pipe(
        take(1),
        tap((inboundQueryParams) => this._store.dispatch(collectAllInboundQueryParams({ inboundQueryParams }))),
        mapTo(true)
    );

    // TODO: change logic here to get the username from the token if we have a token
    //       (note we probably want to silently catch an error on this since we don't need to present an error to the customer)
    parseTokenAndCollectUsername$ = of(true);

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'account' }));
        return this.collectInboundQueryParams$.pipe(
            withLatestFrom(this._store.select(getTokenFromInboundQueryParams)),
            concatMap(([, atok]) => {
                if (atok) {
                    return this._loadAccountFromTokenUsernameWorkflowService.build({ token: atok }).pipe(
                        tap((response) => {
                            if (response) {
                                this._store.dispatch(setUsernameToPrefill({ username: response }));
                            }
                        }),
                        catchError((error) => {
                            this._store.dispatch(pageDataFinishedLoading());
                            return of(true);
                        })
                    );
                } else {
                    return atok ? this.parseTokenAndCollectUsername$ : of(true);
                }
            }),
            tap(() => {
                this._store.dispatch(pageDataFinishedLoading());
            }),
            mapTo(true)
        );
    }
}
