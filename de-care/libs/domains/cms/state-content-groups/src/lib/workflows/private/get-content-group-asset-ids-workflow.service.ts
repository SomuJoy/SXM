import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentGroupService } from '../../data-services/content-group.service';

interface AssetInfo {
    id: number;
    type: string;
    subtype: string;
}

@Injectable({ providedIn: 'root' })
export class GetContentGroupAssetIdsWorkflowService implements DataWorkflow<number, AssetInfo[]> {
    constructor(private readonly _contentGroupService: ContentGroupService) {}

    build(id: number): Observable<AssetInfo[]> {
        return this._contentGroupService.getContentGroupAssetsById(id).pipe(
            map(
                (results) =>
                    results?.associations?.content?.map(({ id, type, subtype }) => ({
                        id,
                        type,
                        subtype,
                    })) || []
            )
        );
    }
}
