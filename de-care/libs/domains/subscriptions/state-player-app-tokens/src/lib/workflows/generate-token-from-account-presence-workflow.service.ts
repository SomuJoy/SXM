import { Injectable } from '@angular/core';
import { behaviorEventReactionTokenForSubscriptionGenerationFailure, behaviorEventReactionTokenForSubscriptionGenerationSuccess } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataPlayerAppTokenService } from '../data-services/data-player-app-token.service';

interface GenerateTokenFromAccountPresenceWorkflowRequest {
    atok?: string;
    dtok?: string;
    radioid?: string;
    act?: string;
}

export interface GenerateTokenFromAccountPresenceWorkflowResponse {
    token: string;
}

export type GenerateTokenFromAccountPresenceWorkflowServiceError = 'SUBSCRIPTION_ID_FOUND_SXIR_CREDENTIAL_NOT_SET';

@Injectable({ providedIn: 'root' })
export class GenerateTokenFromAccountPresenceWorkflowService
    implements DataWorkflow<GenerateTokenFromAccountPresenceWorkflowRequest, GenerateTokenFromAccountPresenceWorkflowResponse>
{
    constructor(private readonly _store: Store, private readonly _dataPlayerAppTokenService: DataPlayerAppTokenService) {}

    build({ atok, dtok, radioid, act }: GenerateTokenFromAccountPresenceWorkflowRequest): Observable<GenerateTokenFromAccountPresenceWorkflowResponse> {
        let requestPayload = {};
        if (dtok) {
            requestPayload = { deviceToken: dtok };
        } else if (radioid && act) {
            requestPayload = { radioId: radioid, accountNumber: act.replace(/[^0-9]+/, '') };
        } else if (atok) {
            requestPayload = { accountToken: atok };
        }
        return this._dataPlayerAppTokenService.getToken(requestPayload).pipe(
            map(({ token }) => token),
            tap((token) => {
                if (token) {
                    this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationSuccess());
                } else {
                    this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationFailure({ failure: 'no-token' }));
                }
            }),
            map((token) => ({
                token,
            })),
            // Silently catch errors so callers don't need to worry about handling Observable stream errors
            catchError((e) => {
                this._store.dispatch(behaviorEventReactionTokenForSubscriptionGenerationFailure({ failure: 'token-generation-error' }));
                if (e?.errorCode === 'SUBSCRIPTION_ID_FOUND_SXIR_CREDENTIAL_NOT_SET') {
                    return throwError('SUBSCRIPTION_ID_FOUND_SXIR_CREDENTIAL_NOT_SET' as GenerateTokenFromAccountPresenceWorkflowServiceError);
                }
                return of(null);
            })
        );
    }
}
