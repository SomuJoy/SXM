import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CheckStudentEligibilityService, OfferCheckEligibilityStudentResponseModel } from '../dataservices/check-student-eligibility.service';

export type ProcessResultStatus =
    | 'CONFIRMATION'
    | 'ERROR'
    | 'ACTIVE_SUBSCRIPTION'
    | 'CHECKOUT'
    | 'NO_ACTIVE_SUBSCRIPTION'
    | 'INELIGIBLE'
    | 'FAILED_VERIFICATION'
    | 'INVALID_ACCOUNT_TOKEN'
    | 'INVALID_VERIFICATION_TOKEN'
    | 'O2O_SUCCESS';

@Injectable({ providedIn: 'root' })
export class CheckStudentEligibilityStatusWorkflowService implements DataWorkflow<{ subscriptionId: string | null }, ProcessResultStatus> {
    constructor(private _store: Store, private _checkStudentEligibilityService: CheckStudentEligibilityService) {}

    build({ subscriptionId }): Observable<ProcessResultStatus> {
        return this._checkStudentEligibilityService.checkEligibilityForStudent(subscriptionId).pipe(
            map<OfferCheckEligibilityStudentResponseModel, ProcessResultStatus>(result => {
                switch (result.status) {
                    case 'O2O_ELIGIBLE':
                        return 'O2O_SUCCESS';
                    case 'CHANGE_PLAN_ELIGIBLE':
                        return 'CONFIRMATION';
                    case 'ALREADY_EXTENDED':
                        return 'ACTIVE_SUBSCRIPTION';
                    case 'INELIGIBLE':
                        return 'INELIGIBLE';
                    default:
                        return 'ERROR';
                }
            }),
            catchError(() => {
                return of<ProcessResultStatus>('ERROR');
            })
        );
    }
}
