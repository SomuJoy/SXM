import { removePrepaidRedeemFailed } from './state/actions';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { RemovePrepaidCardWorkFlowService } from '@de-care/domains/customer/state-prepaid-redeem';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RemovePrepaidRedeemWorkflow implements DataWorkflow<any, any> {
    constructor(private _removePrepaidCardWorkFlowService: RemovePrepaidCardWorkFlowService, private _store: Store) {}

    build() {
        return this._removePrepaidCardWorkFlowService.build().pipe(
            catchError(error => {
                this._store.dispatch(removePrepaidRedeemFailed());
                return throwError(`failed to remove prepaid ${error}`);
            })
        );
    }
}
