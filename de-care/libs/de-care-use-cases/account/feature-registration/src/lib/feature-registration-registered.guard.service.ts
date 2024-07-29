import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { selectAccountIsAlreadyRegistered } from '@de-care/de-care-use-cases/account/state-registration';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanActivateRegistrationAlreadyRegisteredGuardService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate() {
        return this._store.pipe(
            select(selectAccountIsAlreadyRegistered),
            take(1),
            map(result => (result ? true : this._handleAccountNotAlreadyRegistered())),
            catchError(() => of(this._handleAccountNotAlreadyRegistered()))
        );
    }

    private _handleAccountNotAlreadyRegistered(): UrlTree {
        return this._router.createUrlTree(['account', 'registration']);
    }
}
