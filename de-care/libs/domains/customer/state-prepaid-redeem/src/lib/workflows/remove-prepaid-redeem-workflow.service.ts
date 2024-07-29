import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { RemovePrepaidRedeemService } from '../data-services/remove-prepaid-redeem.service';

@Injectable({ providedIn: 'root' })
export class RemovePrepaidCardWorkFlowService implements DataWorkflow<void, void> {
    constructor(private readonly _removePrepaidRedeemService: RemovePrepaidRedeemService) {}

    build(): Observable<void> {
        return this._removePrepaidRedeemService.removePrepaidCard();
    }
}
