import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateAccountBillingAddressRequest, UpdateAccountBillingAddressService } from '../data-services/update-account-billing-address.service';

@Injectable({ providedIn: 'root' })
export class UpdateAccountBillingAddressWorkflowService implements DataWorkflow<UpdateAccountBillingAddressRequest, boolean> {
    constructor(private readonly _updateAccountBillingAddressService: UpdateAccountBillingAddressService) {}

    build(data: UpdateAccountBillingAddressRequest): Observable<boolean> {
        return this._updateAccountBillingAddressService.build(data).pipe(map(() => true));
    }
}
