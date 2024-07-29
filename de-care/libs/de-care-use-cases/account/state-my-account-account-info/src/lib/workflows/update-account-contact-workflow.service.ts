import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UpdateAccountCustomerInfoWorkflowService } from '@de-care/domains/account/state-management';
import { patchContactInfo } from '@de-care/domains/account/state-account';

export interface UpdateAccountCustomerInfoRequest {
    firstName: string;
    lastName: string;
	email: string;
	phoneNumber: string;
    billingAddressSameAsService: boolean;
    serviceAddress: Address;
}

export interface Address {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateAccountContactInfoWorkflowService implements DataWorkflow<UpdateAccountCustomerInfoRequest, boolean> {
    constructor(private readonly _updateAccountCustomerInfoWorkflowService: UpdateAccountCustomerInfoWorkflowService, private readonly _store: Store) {}

    build(request: UpdateAccountCustomerInfoRequest): Observable<any> {
        return this._updateAccountCustomerInfoWorkflowService.build(request).pipe(
            tap(() => {
                this._store.dispatch(patchContactInfo({ firstName: request.firstName, 
                										lastName: request.lastName, 
                										phone: request.phoneNumber,
                										email: request.email,
                										billingAddressSameAsService: request.billingAddressSameAsService,
                										serviceAddress: {
															streetAddress: request.serviceAddress.addressLine1,
												            city: request.serviceAddress.city,
												            state: request.serviceAddress.state,
												            postalCode: request.serviceAddress.zipCode
														}
													}));
            }),
            mapTo(true),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
