import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { DataStreamingPasswordResetTokenService } from '../data-services/data-streaming-password-reset-token.service';
import { catchError, mapTo, tap } from 'rxjs/operators';

interface VerifyStreamingPasswordResetTokenIsValidWorkflowRequest {
    resetToken: string;
}

export type VerifyStreamingPasswordResetTokenIsValidWorkflowErrors = '';

@Injectable({ providedIn: 'root' })
export class VerifyStreamingPasswordResetTokenIsValidWorkflowService implements DataWorkflow<VerifyStreamingPasswordResetTokenIsValidWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataStreamingPasswordResetTokenService: DataStreamingPasswordResetTokenService) {}

    build(request: VerifyStreamingPasswordResetTokenIsValidWorkflowRequest): Observable<boolean> {
        return this._dataStreamingPasswordResetTokenService.validateToken(request).pipe(
            tap(() => {
                // TODO: Add any behavior tracking needed here
            }),
            mapTo(true),
            catchError((error) => {
                // TODO: add error type mapping here to return type of VerifyStreamingPasswordResetTokenIsValidWorkflowErrors
                return throwError(error);
            })
        );
    }
}
