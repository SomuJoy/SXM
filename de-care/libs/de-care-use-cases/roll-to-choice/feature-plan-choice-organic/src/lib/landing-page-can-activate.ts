import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { getLandingPageInboundUrlParams, LoadPlansWorkflowService } from '@de-care/de-care-use-cases/roll-to-choice/state-plan-choice-organic';

// subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=BASIC

@Injectable()
export class LandingPageCanActivate implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store, private readonly _loadPlansWorkflowService: LoadPlansWorkflowService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(getLandingPageInboundUrlParams),
            take(1),
            concatMap(({ programCode, renewalCode }) => {
                return this._loadPlansWorkflowService.build({ programCode, renewalCode }).pipe(
                    map(() => true),
                    catchError(() =>
                        of(
                            this._router.createUrlTree(['/subscribe/checkout'], {
                                queryParams: {
                                    ...(!!programCode && { programCode })
                                }
                            })
                        )
                    )
                );
            })
        );
    }
}
