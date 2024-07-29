import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { CreateStreamingTrialWorkflowErrors, CreateStreamingTrialWorkflowService } from '@de-care/domains/account/state-account';
import { catchError, concatMap, take } from 'rxjs/operators';
import { selectInboundQueryParamsFreeListenCampaignId } from '../state/selectors';

export type ActivateFreeListenByEmailWorkflowErrors =
    | 'INELIGIBLE'
    | 'EXISTING_ACCOUNT'
    | 'INVALID_USERNAME_OR_PASSWORD'
    | 'INVALID_ZIP_CODE'
    | 'INVALID_PHONE_NUMBER'
    | 'INVALID_EMAIL';

@Injectable({ providedIn: 'root' })
export class ActivateFreeListenByEmailWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _createStreamingTrialWorkflowService: CreateStreamingTrialWorkflowService) {}

    build(email: string): Observable<boolean> {
        return this._store.select(selectInboundQueryParamsFreeListenCampaignId).pipe(
            take(1),
            concatMap((promoCode) => this._createStreamingTrialWorkflowService.build({ email, promoCode })),
            catchError((error: CreateStreamingTrialWorkflowErrors) => {
                // TODO: add error type mapping here to return type of ActivateFreeListenByEmailWorkflowErrors
                return throwError(error);
            })
        );
    }
}
