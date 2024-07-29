import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { concatMap, map, take } from 'rxjs/operators';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { setSubscriptionId } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-google';

@Injectable({ providedIn: 'root' })
export class LandingPageCanActivateService implements CanActivate {
    constructor(private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService, private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            concatMap(() =>
                this._store.pipe(
                    select(getNormalizedQueryParams),
                    take(1),
                    map(({ subscriptionid: subscriptionId }) => {
                        if (subscriptionId) {
                            this._store.dispatch(setSubscriptionId({ subscriptionId }));
                            return true;
                        } else {
                            // Todo will be redirected if getting any errors
                        }
                    })
                )
            )
        );
    }
}
