import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SetSweepstakesInfo } from '@de-care/checkout-state';
import { UrlHelperService } from '@de-care/app-common';
import { ContestParams, SweepstakesActionParams } from '@de-care/data-services';

@Injectable({
    providedIn: 'root'
})
export class CheckoutSweepstakesResolver implements Resolve<any> {
    constructor(private _store: Store<{}>, private _urlHelper: UrlHelperService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        const contestId = route.queryParamMap.get(ContestParams.contestId);
        const officialRulesUrl = route.queryParamMap.get(ContestParams.contestUrl);

        const sweepstakesInfo: SweepstakesActionParams = {
            [ContestParams.contestId]: contestId,
            [ContestParams.contestUrl]: officialRulesUrl
        };

        this._store.dispatch(SetSweepstakesInfo({ payload: sweepstakesInfo }));

        return of(null);
    }
}
