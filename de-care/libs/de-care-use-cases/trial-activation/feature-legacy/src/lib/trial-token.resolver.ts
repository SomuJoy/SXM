import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { UrlHelperService } from '@de-care/app-common';
import { ServerResponseProspectModel, DataTrialService } from '@de-care/data-services';
import { catchError } from 'rxjs/operators';
import { TrialAccountNavigationService } from './trial-account-navigation.service';

@Injectable()
export class TrialTokenResolver implements Resolve<Observable<ServerResponseProspectModel>> {
    constructor(private _urlHelperService: UrlHelperService, private _dataTrial: DataTrialService, private _trialAccountNavigation: TrialAccountNavigationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServerResponseProspectModel> {
        const prospectToken = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'prospecttkn');
        return this._dataTrial.token(prospectToken, false).pipe(
            catchError((err: Error) => {
                this._trialAccountNavigation.gotoTrialExpiredPage();
                return EMPTY;
            })
        );
    }
}
