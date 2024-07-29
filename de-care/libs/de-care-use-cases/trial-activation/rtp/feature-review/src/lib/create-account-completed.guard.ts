import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { getIsCreateAccountStepComplete } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreateAccountCompletedGuard implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate() {
        return this._store.pipe(select(getIsCreateAccountStepComplete), take(1), map(Boolean));
    }
}
