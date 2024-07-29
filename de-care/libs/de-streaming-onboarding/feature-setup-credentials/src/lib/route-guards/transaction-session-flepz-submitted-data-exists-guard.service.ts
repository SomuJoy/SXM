import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { transactionSessionFlepzSubmittedDataExists } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class TransactionSessionFlepzSubmittedDataExistsGuard implements CanActivate {
    constructor(private readonly _store: Store, private _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(transactionSessionFlepzSubmittedDataExists),
            take(1),
            // TODO: see if we can come up with a way to dynamically get this route path
            //       so we don't need the segment /setup-credentials which is actually set
            //       up in the app routes
            map(sessionDataExists => (sessionDataExists ? true : this._router.createUrlTree(['/setup-credentials/find-account'])))
        );
    }
}
