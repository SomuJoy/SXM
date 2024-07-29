import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadStreamingOffersForPresentmentWorkflowService implements DataWorkflow<void, boolean> {
    build(): Observable<boolean> {
        return of(true);
    }
}
