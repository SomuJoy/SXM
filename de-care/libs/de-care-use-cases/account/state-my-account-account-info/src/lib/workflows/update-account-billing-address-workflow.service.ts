import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { patchBillingAddress } from 'libs/domains/account/state-account/src/lib/state/actions';
import { UpdateAccountBillingAddressWorkflowService } from '@de-care/domains/account/state-management';

export interface UpdateAccountBillingAddressRequest {
    billingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

@Injectable({ providedIn: 'root' })
export class UpdateAccountBillingAddressInfoWorkflowService implements DataWorkflow<UpdateAccountBillingAddressRequest, boolean> {
    constructor(private readonly _updateAccountBillingAddressWorkflowService: UpdateAccountBillingAddressWorkflowService, private readonly _store: Store) {}

    build(request: UpdateAccountBillingAddressRequest): Observable<any> {
        return this._updateAccountBillingAddressWorkflowService.build(request).pipe(
            tap(() => {
                this._store.dispatch(patchBillingAddress({ billingAddress: request.billingAddress }));
            }),
            mapTo(true),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
