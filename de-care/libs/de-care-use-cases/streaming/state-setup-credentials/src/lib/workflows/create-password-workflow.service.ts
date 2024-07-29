import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { CreateStreamingPasswordWorkflowErrors, CreateStreamingPasswordWorkflowService } from '@de-care/domains/account/state-account';
import { catchError, concatMap, take, tap } from 'rxjs/operators';
import { selectInboundQueryParamsPasswordResetToken } from '../state/selectors';
import { processInboundQueryParams } from '../state/public.actions';

export type CreatePasswordWorkflowErrors = 'SYSTEM' | 'INVALID_PASSWORD_RESET_TOKEN' | 'EXPIRED_PASSWORD_RESET_TOKEN';

@Injectable({ providedIn: 'root' })
export class CreatePasswordWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _createStreamingPasswordWorkflowService: CreateStreamingPasswordWorkflowService) {}

    build(newPassword: string): Observable<boolean> {
        this._store.dispatch(processInboundQueryParams());
        return this._store.select(selectInboundQueryParamsPasswordResetToken).pipe(
            take(1),
            concatMap((resetKey) => this._createStreamingPasswordWorkflowService.build({ resetKey, newPassword })),
            tap(() => {
                // TODO: add logic here to dispatch behavior
            }),
            catchError((error: CreateStreamingPasswordWorkflowErrors) => {
                // TODO: add error type mapping here to return type of LoadCreatePasswordDataWorkflowErrors
                return throwError(error);
            })
        );
    }
}
