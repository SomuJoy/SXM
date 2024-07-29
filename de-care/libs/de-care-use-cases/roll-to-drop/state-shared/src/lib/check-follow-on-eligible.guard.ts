import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { map, mapTo } from 'rxjs/operators';
import { setShowFollowOn } from './state/actions';

@Injectable({
    providedIn: 'root'
})
export class CheckFollowOnEligibleGuard implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate() {
        return this._store.select(getNormalizedQueryParams).pipe(
            map(({ nofollowon }) => !!nofollowon),
            map(this._setShowFollowOnOptions.bind(this)),
            mapTo(true)
        );
    }

    private _setShowFollowOnOptions(noFollowOn: boolean) {
        this._store.dispatch(setShowFollowOn({ showFollowOnSelection: !noFollowOn }));
    }
}
