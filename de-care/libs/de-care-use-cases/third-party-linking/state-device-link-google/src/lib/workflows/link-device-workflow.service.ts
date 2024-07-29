import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { getSubscriptionId } from '../state/selectors';
import { GoogleLoginService } from '@de-care/domains/subscriptions/state-google-linking';

export interface LinkDevicePayload {
    subscriptionId: number;
}

@Injectable({ providedIn: 'root' })
export class LinkDeviceWorkflowService {
    constructor(private readonly _store: Store, private readonly _googleLoginService: GoogleLoginService) {}

    build() {
        return this._store.pipe(
            select(getSubscriptionId),
            take(1),
            concatMap((subscriptionId) => {
                return !subscriptionId
                    ? of(false)
                    : this._googleLoginService
                          .authenticate({
                              subscriptionId: +subscriptionId,
                          })
                          .pipe(
                              map((result) => of(true)),
                              catchError(() => of(false))
                          );
            })
        );
    }
}
