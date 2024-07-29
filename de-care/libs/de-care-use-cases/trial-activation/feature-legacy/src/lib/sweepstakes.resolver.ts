import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ContestParams, SweepstakesModel } from '@de-care/data-services';
import { UrlHelperService } from '@de-care/app-common';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SweepstakesResolver implements Resolve<any> {
    constructor(private _urlHelper: UrlHelperService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SweepstakesModel> {
        const contestId = this._urlHelper.getCaseInsensitiveParam(route.queryParamMap, ContestParams.contestId);

        // TODO: This logic is duplicated in the checkout selector
        const isEligible = contestId ? contestId.length > 0 : false;

        const officialRulesUrl = this._urlHelper.getCaseInsensitiveParam(route.queryParamMap, ContestParams.contestUrl);

        const sweepstakesInfo: SweepstakesModel = {
            id: contestId,
            officialRulesUrl
        };

        return isEligible ? of(sweepstakesInfo) : of(null);
    }
}
