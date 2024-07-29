import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

export type LookupRadioForSwapWorkflowServiceResults = 'CAN_SWAP' | 'REQUIRES_SC';
export type LookupRadioForSwapWorkflowServiceErrors = 'DEVICE_NOT_SUPPORTED' | 'INVALID_RADIO_ID' | 'INVALID_VIN';

@Injectable({ providedIn: 'root' })
export class LookupRadioForSwapWorkflowService implements DataWorkflow<{ deviceId: string }, LookupRadioForSwapWorkflowServiceResults> {
    constructor(private readonly _store: Store) {}

    build({ deviceId }): Observable<LookupRadioForSwapWorkflowServiceResults> {
        // TODO: add logic to do device lookup
        return of('CAN_SWAP');
    }
}
