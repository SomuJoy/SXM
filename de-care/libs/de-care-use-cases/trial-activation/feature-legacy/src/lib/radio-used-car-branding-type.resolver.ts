import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { PackageModel } from '@de-care/data-services';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TrialAccountNavigationService } from './trial-account-navigation.service';
import { TrialRtdLoadOffersCustomerWorkflowService } from '@de-care/de-care-use-cases/trial-activation/state-legacy';

@Injectable()
export class RadioUsedCarBrandingTypeResolver implements Resolve<Observable<{ radioId: string; offer: PackageModel; displayNucaptcha: boolean }>> {
    constructor(
        private _urlHelperService: UrlHelperService,
        private _trialRtdLoadOffersCustomerWorkflowService: TrialRtdLoadOffersCustomerWorkflowService,
        private _trialAccountNavigation: TrialAccountNavigationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{ radioId: string; offer: PackageModel; displayNucaptcha: boolean }> {
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'radioid');
        const usedCarBrandingType: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'usedCarBrandingType');
        const programCode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programCode');

        if (radioId && usedCarBrandingType) {
            return this._trialRtdLoadOffersCustomerWorkflowService.build({ usedCarBrandingType, radioId, programCode }).pipe(
                catchError(err => {
                    this._trialAccountNavigation.goToBauNouv();
                    return throwError(err);
                })
            );
        } else {
            this._trialAccountNavigation.goToBauNouv();
            return EMPTY;
        }
    }
}
