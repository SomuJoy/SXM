import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';
import { Account } from '../data-services/account.interface';
import { Store } from '@ngrx/store';

export interface FindAccountNonPiiDirectResponseWorkflowRequest {
    accountNumber?: string;
    radioId?: string;
    lastName?: string;
    identifiedUser?: boolean;
    subscriptionId?: string;
}
@Injectable({ providedIn: 'root' })
export class FindAccountNonPiiDirectResponseWorkflowService implements DataWorkflow<FindAccountNonPiiDirectResponseWorkflowRequest, Account> {
    constructor(private readonly _dataAccountNonPiiService: DataAccountNonPiiService, private readonly _store: Store) {}

    build(request: FindAccountNonPiiDirectResponseWorkflowRequest): Observable<any> {
        return this._dataAccountNonPiiService.getAccountNonPii(request);
    }
}
