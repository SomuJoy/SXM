import { Injectable } from '@angular/core';
import { RecoverStreamingTokenDataWorkflowService, StreamingTokenDataServiceRequest } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { setDataFromStreamingToken } from '../state/actions';
import { setMaskedEmail } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';

export enum RTDStreamingTokenResponse {
    HasToken,
    NoToken,
    HasAccount
}

@Injectable({ providedIn: 'root' })
export class RecoverRTDStreamingTokenDataWorkflowService implements DataWorkflow<StreamingTokenDataServiceRequest, RTDStreamingTokenResponse> {
    constructor(private readonly _recoverStreamingTokenDataWorkflowService: RecoverStreamingTokenDataWorkflowService, private readonly _store: Store) {}

    build(tkn: StreamingTokenDataServiceRequest): Observable<RTDStreamingTokenResponse> {
        return this._recoverStreamingTokenDataWorkflowService.build(tkn).pipe(
            map(resp => ({ ...resp })),
            tap(resp => this._store.dispatch(setDataFromStreamingToken(resp))),
            tap(resp => this._store.dispatch(setMaskedEmail({ maskedEmail: resp.maskedUserName }))),
            map(response => (response?.hasAccount ? RTDStreamingTokenResponse.HasAccount : RTDStreamingTokenResponse.HasToken)),
            catchError(error => {
                const fieldErrors = error?.error?.error?.fieldErrors;
                const errorCode = fieldErrors && Array.isArray(fieldErrors) && fieldErrors?.length > 0 ? fieldErrors[0].errorCode : null;
                if (errorCode === 'DATA_NOT_FOUND' || errorCode === 'INVALID_TOKEN_DATA') {
                    return of(RTDStreamingTokenResponse.NoToken);
                } else {
                    throwError(error);
                }
            })
        );
    }
}
