import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { processInboundQueryParams, setDeviceActivationIsForTrial } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { mapTo, take, tap } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class ActivateDevicePageCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): Observable<boolean> {
        this._store.dispatch(processInboundQueryParams());
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            tap(({ tvtrial }) => {
                if (tvtrial) {
                    this._store.dispatch(setDeviceActivationIsForTrial());
                }
                this._store.dispatch(pageDataFinishedLoading());
            }),
            mapTo(true)
        );
    }
}
