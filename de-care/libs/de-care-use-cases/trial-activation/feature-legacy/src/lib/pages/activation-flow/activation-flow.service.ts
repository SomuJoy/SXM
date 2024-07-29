import { Injectable } from '@angular/core';
import { PackageModel, SweepstakesModel } from '@de-care/data-services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountData } from '../../page-parts/new-account-form-step/new-account-form-step.component';
import { TrialActivationService } from '../../processing/trial-activation.service';
import { Account } from '@de-care/domains/account/state-account';

@Injectable()
export class ActivationFlowService {
    constructor(private _trialActivationService: TrialActivationService) {}

    activateExistingAccount(
        offer: PackageModel,
        password: string,
        planCode: string,
        radioId: string,
        username: string,
        sweepstakesInfo?: SweepstakesModel
    ): Observable<Account> {
        return this._trialActivationService.activateExistingAccount(offer, password, planCode, radioId, username, sweepstakesInfo).pipe(map((account) => account));
    }

    activateNewAccount(accountData: AccountData, lang: string, offer: PackageModel, radioId: string, sweepstakesInfo?: SweepstakesModel): Observable<Account> {
        return this._trialActivationService.activateNewAccount(accountData, radioId, offer, lang, sweepstakesInfo);
    }
}
