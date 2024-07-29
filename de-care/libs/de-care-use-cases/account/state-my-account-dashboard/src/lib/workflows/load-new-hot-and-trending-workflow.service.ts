import { Injectable } from '@angular/core';
import { getContentGroupByName, LoadContentGroupByNameWorkflowService } from '@de-care/domains/cms/state-content-groups';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';

export type LoadNewHotAndTrendingWorkflowErrors = 'FALIED_TO_LOAD_CONTENT_GROUP';
export interface NewHotAndTrendingContent {
    title: string;
    cards: { imageUrl: string; body: string }[];
}

@Injectable({ providedIn: 'root' })
export class LoadNewHotAndTrendingWorkflowService implements DataWorkflow<void, NewHotAndTrendingContent> {
    constructor(private readonly _loadContentGroupByNameWorkflowService: LoadContentGroupByNameWorkflowService, private readonly _store: Store) {}

    build(): Observable<NewHotAndTrendingContent> {
        return this._loadContentGroupByNameWorkflowService.build('CG Section 4 - Home Variant Mock - Promos').pipe(
            withLatestFrom(this._store.select(getContentGroupByName('CG Section 4 - Home Variant Mock - Promos'))),
            map(([, contentGroup]) => ({
                title: contentGroup.zone2Header.headline,
                cards: contentGroup.imagesWithText.map(({ imageUrl, body }) => ({ imageUrl, body })),
            })),
            catchError(() => {
                return throwError('FALIED_TO_LOAD_CONTENT_GROUP' as LoadNewHotAndTrendingWorkflowErrors);
            })
        );
    }
}
