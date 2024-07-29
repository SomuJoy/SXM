import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RadioIdVerificationStatus, VerifyRadioIdService, RadioIdVerificationStatusEnum } from '../data-services/verify-radio-id.service';
import { setRadioIdVerificationStatus } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class SubmitVerifyRadioIdWorkflow implements DataWorkflow<string, RadioIdVerificationStatus> {
    constructor(private readonly _store: Store, private readonly _verifyRadioIdService: VerifyRadioIdService) {}

    build(radioId: string): Observable<RadioIdVerificationStatus> {
        return this._verifyRadioIdService.authenticationVerifyRadioId({ radioId }).pipe(
            tap(response => this._store.dispatch(setRadioIdVerificationStatus({ status: response.status }))),
            catchError(() => of({ status: RadioIdVerificationStatusEnum.fail }))
        );
    }
}
