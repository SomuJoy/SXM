import { Resolve } from '@angular/router';
import { LoadAlreadyConsolidatedWorkflowService } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlreadyConsolidatedResolverService implements Resolve<any> {
    constructor(private _loadAlreadyConsolidatedWorkflowService: LoadAlreadyConsolidatedWorkflowService) {}

    resolve() {
        return this._loadAlreadyConsolidatedWorkflowService.build();
    }
}
