import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, mapTo, take, tap } from 'rxjs/operators';
import { FetchPartnerInfoService } from '../data-services/fetch-partner-info.service';
import { fallBackCorpIdLoaded, partnerInfoLoaded } from '../state/actions';
import { getIsInitialized } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class FetchPartnerInfoWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _fetchPartnerInfoService: FetchPartnerInfoService) {}

    private _fetchPartnerInfo() {
        return this._fetchPartnerInfoService.fetch().pipe(
            tap(partnerInfo => {
                this._store.dispatch(partnerInfoLoaded({ partners: partnerInfo.partnerInfo }));
                this._store.dispatch(fallBackCorpIdLoaded({ fallbackCorpId: partnerInfo.fallbackCorpId || null }));
            }),
            mapTo(true)
        );
    }

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getIsInitialized),
            take(1),
            concatMap(isInitialized => (isInitialized ? of(true) : this._fetchPartnerInfo()))
        );
    }
}
