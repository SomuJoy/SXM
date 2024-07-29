import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { CustomerValidateResponse, CustomerValidation } from '../data-services/customer-validation.interface';
import { CustomerValidationService } from '../data-services/customer-validation.service';
import { behaviorEventReactionForPrepaidBin } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class CustomerValidationWorkFlowService implements DataWorkflow<CustomerValidation, CustomerValidateResponse> {
    constructor(private readonly _customerValidationService: CustomerValidationService, private readonly _store: Store) {}

    build(requestPayload: CustomerValidation) {
        return this._customerValidationService.validate(requestPayload).pipe(
            tap((customerValidation) => {
                if (customerValidation.ccValidation?.valid) {
                    this._store.dispatch(behaviorEventReactionForPrepaidBin({ prePaidBin: customerValidation.ccValidation.prePaidBin || false }));
                }
            })
        );
    }
}
