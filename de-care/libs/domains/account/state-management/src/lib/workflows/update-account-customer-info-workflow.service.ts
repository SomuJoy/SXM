import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateAccountCustomerInfoRequest, UpdateAccountCustomerInfoService } from '../data-services/update-account-customer-info.service';

@Injectable({ providedIn: 'root' })
export class UpdateAccountCustomerInfoWorkflowService implements DataWorkflow<UpdateAccountCustomerInfoRequest, boolean> {
    constructor(private readonly _updateAccountCustomerInfoService: UpdateAccountCustomerInfoService) {}

    build(data: UpdateAccountCustomerInfoRequest): Observable<boolean> {
        return this._updateAccountCustomerInfoService.build(data).pipe(map(() => true));
    }
}
