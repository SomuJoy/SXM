import { Injectable } from '@angular/core';
import { RemoveInactiveRadioWorkflowService } from '@de-care/domains/account/state-management';

import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { RemoveInactiveRadioRequest } from '@de-care/domains/account/state-management';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { patchRemoveClosedDeviceByRadioId } from '@de-care/domains/account/state-account';

@Injectable({ providedIn: 'root' })
export class RemoveInactiveRadioIdWorkflowService implements DataWorkflow<RemoveInactiveRadioRequest, boolean> {
    constructor(private readonly _removeInactiveRadioWorkflowService: RemoveInactiveRadioWorkflowService, private readonly _store: Store) {}

    build(data: RemoveInactiveRadioRequest): Observable<boolean> {
        return this._removeInactiveRadioWorkflowService.build(data).pipe(tap(() => this._store.dispatch(patchRemoveClosedDeviceByRadioId({ radioId: data.radioId }))));
    }
}
