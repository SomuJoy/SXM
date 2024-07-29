import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { VerifyStreamingPasswordResetTokenIsValidWorkflowErrors, VerifyStreamingPasswordResetTokenIsValidWorkflowService } from '@de-care/domains/account/state-account';
import { catchError, concatMap, take, tap } from 'rxjs/operators';
import { selectInboundQueryParamsPasswordResetToken } from '../state/selectors';
import { processInboundQueryParams } from '../state/public.actions';

export type LoadCreatePasswordDataWorkflowErrors = 'SYSTEM' | 'SESSION_EXPIRED';

@Injectable({ providedIn: 'root' })
export class LoadCreatePasswordDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _verifyStreamingPasswordResetTokenIsValidWorkflowService: VerifyStreamingPasswordResetTokenIsValidWorkflowService
    ) {}

    build(): Observable<boolean> {
        this._store.dispatch(processInboundQueryParams());
        return this._store.select(selectInboundQueryParamsPasswordResetToken).pipe(
            take(1),
            concatMap((resetToken) => this._verifyStreamingPasswordResetTokenIsValidWorkflowService.build({ resetToken })),
            tap(() => {
                this._store.dispatch(pageDataFinishedLoading());
            }),
            catchError((error: VerifyStreamingPasswordResetTokenIsValidWorkflowErrors) => {
                // TODO: add error type mapping here to return type of LoadCreatePasswordDataWorkflowErrors
                return throwError(error);
            })
        );
    }
}
