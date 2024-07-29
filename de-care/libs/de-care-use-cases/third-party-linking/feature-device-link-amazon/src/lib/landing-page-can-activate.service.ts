import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { setSubscriptionId, buildAndSetAmazonUri } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-amazon';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LandingPageCanActivateService implements CanActivate {
    private readonly _window: Window;

    constructor(
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        @Inject(DOCUMENT) document: Document
    ) {
        this._window = document && document.defaultView;
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            concatMap(() =>
                this._store.pipe(
                    select(getNormalizedQueryParams),
                    take(1),
                    map(({ subscriptionid: subscriptionId }) => {
                        if (subscriptionId) {
                            const redirectUri = `${this._window.location.href.split('?')[0]}/amzauth`;
                            this._store.dispatch(setSubscriptionId({ subscriptionId }));
                            this._store.dispatch(buildAndSetAmazonUri({ redirectUri }));
                            return true;
                        } else {
                            return this._router.createUrlTree(['/error']);
                        }
                    })
                )
            ),
            catchError(() => of(this._router.createUrlTree(['/error'])))
        );
    }
}
