import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataAccountService, OemRequest, OemResponse } from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { updateDataLayerWithMarketingId } from '../functions/workflow-helpers';

@Injectable({ providedIn: 'root' })
export class AccountForOemWorkflow implements DataWorkflow<OemRequest, OemResponse> {
    constructor(private _dataAccountService: DataAccountService, private _dataLayerService: DataLayerService) {}

    /**
     * @deprecated Use workflows from @de-care/domains/account/state-account
     */
    build(request: OemRequest): Observable<OemResponse> {
        return this._dataAccountService.oem(request).pipe(
            tap(response => {
                updateDataLayerWithMarketingId(response.marketingId, response.marketingAcctId, this._dataLayerService);
            })
        );
    }
}
