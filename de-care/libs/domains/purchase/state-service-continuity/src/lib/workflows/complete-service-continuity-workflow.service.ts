import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { serviceContinuityError } from '../state/actions';
import { ServiceContinuityResponse, ServiceContinuityRequest } from '../data-services/service-continuity.interface';
import { DataServiceContinuityService } from '../data-services/data-service-continuity.service';
import { isCreditCardError } from '@de-care/shared/de-microservices-common';

export type CompleteServiceContinuityWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class CompleteServiceContinuityWorkflowService implements DataWorkflow<ServiceContinuityRequest, ServiceContinuityResponse> {
    constructor(private _dataServiceContinuity: DataServiceContinuityService, private _store: Store) {}

    build(request: ServiceContinuityRequest): Observable<ServiceContinuityResponse> {
        return this._dataServiceContinuity.serviceContinuity(request).pipe(
            catchError((error) => {
                this._store.dispatch(serviceContinuityError({ error }));
                if (isCreditCardError(error.status, error?.error?.error?.errorPropKey)) {
                    return throwError('CREDIT_CARD_FAILURE' as CompleteServiceContinuityWorkflowServiceError);
                }
                return throwError('SYSTEM' as CompleteServiceContinuityWorkflowServiceError);
            })
        );
    }
}
