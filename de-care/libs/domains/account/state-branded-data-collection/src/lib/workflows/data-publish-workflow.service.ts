import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataPublishService, DataPublishRequest, DataPublishResponse } from '../data-services/data-publish.service';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class DataPublishWorkflowService implements DataWorkflow<DataPublishRequest, boolean> {
    constructor(private readonly _dataPublishService: DataPublishService, private readonly _store: Store) {}

    build(request: DataPublishRequest): Observable<boolean> {
        return this._dataPublishService.publishData(request).pipe(map((resp: DataPublishResponse) => resp.message === 'Success'));
    }
}
