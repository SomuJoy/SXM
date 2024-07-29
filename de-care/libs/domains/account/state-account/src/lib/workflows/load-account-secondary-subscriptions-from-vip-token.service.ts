import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AccountVipElegibleRadiosFromTokenRequestResponse, AccountVipElegibleRadiosFromTokenService } from '../data-services/account-vip-eligible-radios-from-token.service';
import { setAccount, setSecondaryStreamingSubscriptions, setSecondarySubscriptions } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountSecondarySubscriptionsFromVipTokenWorkflowService implements DataWorkflow<string, AccountVipElegibleRadiosFromTokenRequestResponse> {
    constructor(private readonly _accountVipElegibleRadiosFromTokenService: AccountVipElegibleRadiosFromTokenService, private _store: Store) {}

    build(token: string) {
        return this._accountVipElegibleRadiosFromTokenService
            .getSecondarySubscription({
                token,
                student: false,
                tokenType: 'SALES_AUDIO',
            })
            .pipe(
                tap((response) => {
                    this._store.dispatch(setAccount({ account: response.nonPIIAccount }));
                    this._store.dispatch(setSecondarySubscriptions({ secondarySubscriptions: response?.eligibleSecondarySubscriptions }));
                    this._store.dispatch(setSecondaryStreamingSubscriptions({ secondaryStreamingSubscriptions: response?.eligibleSecondaryStreamingSubscriptions }));
                })
            );
    }
}
