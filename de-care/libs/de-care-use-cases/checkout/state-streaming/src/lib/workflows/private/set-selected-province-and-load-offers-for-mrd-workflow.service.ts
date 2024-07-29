import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { LoadOffersForMrdWorkflowService } from './load-offers-for-mrd-workflow.service';

@Injectable({ providedIn: 'root' })
export class SetSelectedProvinceAndLoadOffersForMrdWorkflowService implements DataWorkflow<{ provinceCode: string }, boolean> {
    constructor(private readonly _store: Store, private readonly _loadOffersForMrdWorkflowService: LoadOffersForMrdWorkflowService) {}

    build({ provinceCode }: { provinceCode: string }): Observable<boolean> {
        this._store.dispatch(setSelectedProvinceCode({ provinceCode }));
        return this._loadOffersForMrdWorkflowService.build({});
    }
}
