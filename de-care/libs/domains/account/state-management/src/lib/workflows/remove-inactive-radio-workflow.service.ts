import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoveInactiveRadioService, RemoveInactiveRadioRequest } from '../data-services/remove-inactive-radio.service';
export { RemoveInactiveRadioRequest } from './../data-services/remove-inactive-radio.service';

@Injectable({ providedIn: 'root' })
export class RemoveInactiveRadioWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _removeInactiveRadioService: RemoveInactiveRadioService) {}

    build(radioInfo: RemoveInactiveRadioRequest): Observable<boolean> {
        return this._removeInactiveRadioService.build(radioInfo).pipe(map(() => true));
    }

    // TODO: add error catch to send behavior event
}
