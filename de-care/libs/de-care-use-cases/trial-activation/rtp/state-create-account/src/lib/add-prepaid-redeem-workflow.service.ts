import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PrepaidRedeemRequest, PrepaidRedeemResponse, RedeemPrepaidCardWorkFlowService } from '@de-care/domains/customer/state-prepaid-redeem';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { addPrepaidRedeemFailed } from './state/actions';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddPrepaidRedeemWorkflow implements DataWorkflow<PrepaidRedeemRequest, PrepaidRedeemResponse> {
    constructor(private _redeemPrepaidCardWorkFlowService: RedeemPrepaidCardWorkFlowService, private _store: Store) {}

    build(requestPayload: PrepaidRedeemRequest) {
        return this._redeemPrepaidCardWorkFlowService.build(requestPayload).pipe(
            catchError(error => {
                this._store.dispatch(addPrepaidRedeemFailed());
                return throwError(`failed to redeem prepaid ${error}`);
            })
        );
    }
}
