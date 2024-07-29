import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AvsValidationState, CustomerValidation } from '../data-services/customer-validation.interface';
import { CustomerValidationService } from '../data-services/customer-validation.service';
import { behaviorEventReactionForPrepaidBin } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class CustomerValidationAddressesWorkFlowService implements DataWorkflow<CustomerValidation, AvsValidationState> {
    constructor(private readonly _customerValidationService: CustomerValidationService, private readonly _store: Store) {}

    build(requestPayload: CustomerValidation): Observable<AvsValidationState> {
        return this._customerValidationService.validateAddresses(requestPayload).pipe(
            tap((avsValidation) => {
                if (avsValidation.ccValidation?.valid) {
                    this._store.dispatch(behaviorEventReactionForPrepaidBin({ prePaidBin: avsValidation.ccValidation.prePaidBin || false }));
                }
            })
        );
    }
}
