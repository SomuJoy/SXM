import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { getQueryParams, setReceiverIdFromURL } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerLookupByCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private _store: Store, private _activatedRoute: ActivatedRoute) {}

    canActivate(): Observable<any> {
        return this._store.select(getQueryParams).pipe(
            take(1),
            tap(({ receiver }) => {
                if (receiver) {
                    this._store.dispatch(setReceiverIdFromURL({ receiverId: receiver }));
                    this._router.navigate(['/subscribe/refresh-signal/authenticated-landing-page'], { queryParams: { receiver: receiver } });
                } else {
                    this._navigateTo('/subscribe/refresh-signal/unauthenticated-landing-page');
                }
            })
        );
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
