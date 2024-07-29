import { Injectable } from '@angular/core';
import {
    behaviorEventReactionAuthenticationByRadioVerifyFailure,
    behaviorEventReactionAuthenticationByRadioVerifySuccess,
    behaviorEventErrorsFromUserInteraction
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VerifyService } from '../data-services/verify.service';

interface WorkflowRequest {
    lastName: string;
    phoneNumber: string;
    zipCode: string;
}

@Injectable({ providedIn: 'root' })
export class VerifyAccountByLpzWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _verifyService: VerifyService, private readonly _store: Store) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._verifyService.verify(request).pipe(
            tap(verified => {
                if (verified) {
                    this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifySuccess());
                } else {
                    this._store.dispatch(behaviorEventReactionAuthenticationByRadioVerifyFailure());
                    this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Auth - Failed account verification'] }));
                }
            })
        );
    }
}
