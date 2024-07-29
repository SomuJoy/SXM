import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { setContentGroup } from '../state/actions';
import { GetContentGroupAssetIdsWorkflowService } from './private/get-content-group-asset-ids-workflow.service';
import { GetContentGroupAssetsWorkflowService } from './private/get-content-group-assets-workflow.service';
import { GetContentGroupIdByNameWorkflowService } from './private/get-content-group-id-by-name-workflow.service';

export type LoadContentGroupByNameWorkflowErrors = 'CONTENT_GROUP_NOT_FOUND' | 'ERROR_LOADING_CONTENT_GROUP_CONTENT';

@Injectable({ providedIn: 'root' })
export class LoadContentGroupByNameWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _getContentGroupIdByNameWorkflowService: GetContentGroupIdByNameWorkflowService,
        private readonly _getContentGroupAssetIdsWorkflowService: GetContentGroupAssetIdsWorkflowService,
        private readonly _getContentGroupAssetsWorkflowService: GetContentGroupAssetsWorkflowService,
        private readonly _store: Store
    ) {}

    build(name: string): Observable<boolean> {
        let contentGroupId: number | null = null;
        return this._getContentGroupIdByNameWorkflowService.build(name).pipe(
            map((id) => {
                if (id) {
                    return id;
                }
                throw 'CONTENT_GROUP_NOT_FOUND' as LoadContentGroupByNameWorkflowErrors;
            }),
            tap((id) => {
                contentGroupId = id;
            }),
            concatMap((id) => this._getContentGroupAssetIdsWorkflowService.build(id)),
            concatMap((assets) => this._getContentGroupAssetsWorkflowService.build(assets)),
            tap((results) => {
                this._store.dispatch(
                    setContentGroup({
                        contentGroup: {
                            id: contentGroupId,
                            name,
                            ...results,
                        },
                    })
                );
            }),
            catchError((error) =>
                error === 'CONTENT_GROUP_NOT_FOUND' ? throwError(error) : throwError('ERROR_LOADING_CONTENT_GROUP_CONTENT' as LoadContentGroupByNameWorkflowErrors)
            ),
            map(() => true)
        );
    }
}
