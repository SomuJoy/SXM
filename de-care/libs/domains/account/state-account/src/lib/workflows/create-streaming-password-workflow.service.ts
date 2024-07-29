import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { DataCreateStreamingPasswordService } from '../data-services/data-create-streaming-password.service';
import { catchError, mapTo, tap } from 'rxjs/operators';

interface CreateStreamingPasswordWorkflowRequest {
    newPassword: string;
    resetKey: string;
}

export type CreateStreamingPasswordWorkflowErrors = 'SYSTEM' | 'INVALID_PASSWORD_RESET_TOKEN' | 'EXPIRED_PASSWORD_RESET_TOKEN';

@Injectable({ providedIn: 'root' })
export class CreateStreamingPasswordWorkflowService implements DataWorkflow<CreateStreamingPasswordWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataCreateStreamingPasswordService: DataCreateStreamingPasswordService) {}

    build(request: CreateStreamingPasswordWorkflowRequest): Observable<boolean> {
        return this._dataCreateStreamingPasswordService.createPassword(request).pipe(
            tap(() => {}),
            mapTo(true),
            catchError((error) => {
                let errorType: CreateStreamingPasswordWorkflowErrors = 'SYSTEM';
                if (['INVALID_PASSWORD_RESET_TOKEN'].includes(error.errorCode)) {
                    errorType = 'INVALID_PASSWORD_RESET_TOKEN';
                } else if (['EXPIRED_PASSWORD_RESET_TOKEN'].includes(error.errorCode)) {
                    errorType = 'EXPIRED_PASSWORD_RESET_TOKEN';
                }
                return throwError(errorType);
            })
        );
    }
}
