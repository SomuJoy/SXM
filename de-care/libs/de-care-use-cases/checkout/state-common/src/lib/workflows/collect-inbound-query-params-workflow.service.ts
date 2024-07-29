import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { TranslationUrlParserService } from '@de-care/shared/translation';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { mapTo, take, tap } from 'rxjs/operators';
import { collectAllInboundQueryParams } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class CollectInboundQueryParamsWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _translationUrlParserService: TranslationUrlParserService) {}

    build(): Observable<boolean> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            tap((inboundQueryParams) => {
                this._store.dispatch(collectAllInboundQueryParams({ inboundQueryParams }));
                if (inboundQueryParams?.langpref) {
                    this._translationUrlParserService.setLangFromUrlParam(inboundQueryParams?.langpref);
                }
            }),
            mapTo(true)
        );
    }
}
