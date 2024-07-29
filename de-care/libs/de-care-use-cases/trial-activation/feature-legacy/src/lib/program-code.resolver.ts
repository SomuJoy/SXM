import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UrlHelperService } from '@de-care/app-common';
import { map } from 'rxjs/operators';
import { LoadOfferFromProgramCodeWorkflowService } from '@de-care/de-care-use-cases/trial-activation/state-legacy';

@Injectable()
export class ProgramCodeResolver implements Resolve<any> {
    constructor(private _urlHelperService: UrlHelperService, private readonly _loadOfferFromProgramCodeWorkflowService: LoadOfferFromProgramCodeWorkflowService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const programCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programCode');
        if (!!programCode) {
            return this._loadOfferFromProgramCodeWorkflowService.build({ programCode, streaming: false, student: false }).pipe(map(offer => offer));
        } else {
            return of(null);
        }
    }
}
