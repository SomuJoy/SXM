import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentGroupService } from '../../data-services/content-group.service';

@Injectable({ providedIn: 'root' })
export class GetContentGroupIdByNameWorkflowService implements DataWorkflow<string, number> {
    constructor(private readonly _contentGroupService: ContentGroupService) {}

    build(name: string): Observable<number> {
        return this._contentGroupService
            .getContentGroupByName(name)
            .pipe(map((results) => (Array.isArray(results?.assets) && results.assets.length > 0 ? results.assets[0].id : null)));
    }
}
