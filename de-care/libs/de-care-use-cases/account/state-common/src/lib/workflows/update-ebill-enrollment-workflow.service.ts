import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UpdateEbillEnrollmentWorkflowService } from '@de-care/domains/payment/state-update-ebill-enrollment';
import { patchBillingSummaryEbill, setPrefillEmail } from '@de-care/domains/account/state-account';
import { getAccountEmailAddress, getEbillStatus } from '../state/selectors';

export interface UpdateEbillEnrollmentRequest {
    email?: string;
    ebillEnrollment: boolean;
}

@Injectable({ providedIn: 'root' })
export class UpdateEbillEnrollmentInfoWorkflowService implements DataWorkflow<UpdateEbillEnrollmentRequest, boolean> {
    constructor(private readonly _updateEbillEnrollmentWorkflowService: UpdateEbillEnrollmentWorkflowService, private readonly _store: Store) {}

    build(request: UpdateEbillEnrollmentRequest): Observable<boolean> {
        return combineLatest([this._store.select(getAccountEmailAddress), this._store.select(getEbillStatus)]).pipe(
            take(1),
            concatMap(([accountEmail, hasEbill]) => {
                let params: UpdateEbillEnrollmentRequest;
                if (request?.email && (!hasEbill || (hasEbill && request?.email.toLowerCase() !== accountEmail.toLowerCase()))) {
                    params = { ...request, email: request?.email.toLowerCase() };
                } else if (!request?.email && !request.ebillEnrollment) {
                    params = { ...request };
                } else {
                    return of(true);
                }
                return this._updateEbillEnrollmentWorkflowService.build(params).pipe(
                    tap(() => {
                        if (params?.email) {
                            this._store.dispatch(setPrefillEmail({ email: params?.email.toUpperCase() }));
                        }
                        this._store.dispatch(patchBillingSummaryEbill({ isEBill: params.ebillEnrollment }));
                    }),
                    mapTo(true),
                    catchError((error) => {
                        return throwError({ error });
                    })
                );
            })
        );
    }
}
