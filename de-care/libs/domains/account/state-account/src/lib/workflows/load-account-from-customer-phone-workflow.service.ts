import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataIdentityCustomerPhoneService } from '../data-services/data-identity-customer-phone.service';

export interface CustomerPhoneRequest {
    email?: string;
    phone: any;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountFromCustomerPhoneWorkflowService implements DataWorkflow<CustomerPhoneRequest, boolean> {
    constructor(private readonly _dataIdentityCustomerPhoneService: DataIdentityCustomerPhoneService) {}

    build(request: CustomerPhoneRequest): Observable<any> {
        return this._dataIdentityCustomerPhoneService.getAccount(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
