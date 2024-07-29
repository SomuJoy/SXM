import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ObjectTokenizerService, UrlHelperService } from '@de-care/app-common';
import { OfferDealModel, PlanModel, RadioModel, SweepstakesModel } from '@de-care/data-services';
import { Plan } from '@de-care/domains/account/state-account';

export interface TrialActivationThanksData {
    email: string;
    radioId: string;
    trialEndDate: string;
    isEligibleForRegistration: boolean;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
    plans?: PlanModel[] | Plan[];
    radioService?: RadioModel;
    sweepstakesInfo?: SweepstakesModel;
    firstName?: string;
    hasUserCredentials?: boolean;
    useEmailAsUsername?: boolean;
    hasExistingAccount?: boolean;
    deal?: OfferDealModel;
}

@Injectable()
export class TrialActivationThanksResolver implements Resolve<Observable<TrialActivationThanksData>> {
    constructor(private _urlHelperService: UrlHelperService, private _objectTokenizerService: ObjectTokenizerService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<TrialActivationThanksData> {
        const thanksToken = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'thanksToken');
        if (!thanksToken) {
            // TODO: consider having a class representation for this error instead of magic string.
            return throwError('Required query param missing: thanksToken');
        }
        const data = this._objectTokenizerService.detokenize<TrialActivationThanksData>(thanksToken);
        if (data.hasOwnProperty('error')) {
            // TODO: consider having a class representation for this error instead of magic string.
            return throwError('Error decoding thanks token');
        } else {
            return of(data as TrialActivationThanksData);
        }
    }
}
