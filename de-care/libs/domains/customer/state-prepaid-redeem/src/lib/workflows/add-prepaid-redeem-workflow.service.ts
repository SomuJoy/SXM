import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { AddPrepaidRedeemService, PrepaidRedeemRequest, PrepaidRedeemResponse } from './../data-services/add-prepaid-redeem.service';

@Injectable({ providedIn: 'root' })
export class RedeemPrepaidCardWorkFlowService implements DataWorkflow<PrepaidRedeemRequest, PrepaidRedeemResponse> {
    constructor(private readonly _addPrepaidRedeemService: AddPrepaidRedeemService) {}

    build(requestPayload: PrepaidRedeemRequest): Observable<PrepaidRedeemResponse> {
        return this._addPrepaidRedeemService.redeemPrepaidCard(requestPayload);
    }
}
