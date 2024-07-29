import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, throwError, EMPTY } from 'rxjs';
import { UrlHelperService } from '@de-care/app-common';
import { catchError } from 'rxjs/operators';
import { TrialAccountNavigationService } from './trial-account-navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { normalizeAccountNumber } from '@de-care/data-services';

@Injectable()
export class RadioResolver implements Resolve<Observable<any>> {
    constructor(private _urlHelperService: UrlHelperService, private _trialAccountNavigation: TrialAccountNavigationService, private _nonPiiSrv: NonPiiLookupWorkflow) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'radioid');
        const accountNumber: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'act');

        if (!!radioId && !!accountNumber) {
            const parsedAccountNum = normalizeAccountNumber(accountNumber);
            const last4DigitsOfAccount = parsedAccountNum.substring(parsedAccountNum.length - 4);

            return this._nonPiiSrv
                .build({
                    accountNumber: last4DigitsOfAccount,
                    radioId: radioId
                })
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 400) {
                            const appError: Error = new Error('Invalid params to nonPii call.');
                            this._trialAccountNavigation.goToBauNouv();
                            return throwError(appError);
                        } else {
                            this._trialAccountNavigation.goToBauNouv();
                            return throwError(error);
                        }
                    })
                );
        } else {
            this._trialAccountNavigation.goToBauNouv();
            return EMPTY;
        }
    }
}
