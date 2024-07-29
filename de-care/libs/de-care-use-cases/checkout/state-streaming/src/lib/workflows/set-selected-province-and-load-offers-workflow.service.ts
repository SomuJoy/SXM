import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { LoadOffersWorkflowService } from './private/load-offers-workflow.service';

@Injectable({ providedIn: 'root' })
export class SetSelectedProvinceAndLoadOffersWorkflowService implements DataWorkflow<{ provinceCode: string }, boolean> {
    constructor(private readonly _store: Store, private readonly _loadOffersWorkflowService: LoadOffersWorkflowService) {}

    build({ provinceCode }: { provinceCode: string }): Observable<boolean> {
        this._store.dispatch(setSelectedProvinceCode({ provinceCode }));
        return this._loadOffersWorkflowService.build({});
    }
}
