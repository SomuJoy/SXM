import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { getIsInBeatTheSoldScenario } from '@de-care/de-care-use-cases/account/state-registration';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanActivateRegistrationCNAGuardService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate() {
        return this._store.pipe(
            select(getIsInBeatTheSoldScenario),
            take(1),
            map(result => (result ? result : this._handleNotBeatTheSold())),
            catchError(() => of(this._handleNotBeatTheSold()))
        );
    }

    private _handleNotBeatTheSold(): UrlTree {
        return this._router.createUrlTree(['account', 'registration']);
    }
}
