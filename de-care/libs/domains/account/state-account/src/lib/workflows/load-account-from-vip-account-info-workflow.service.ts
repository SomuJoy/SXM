import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { DataAccountVIPService } from '../data-services/data-account-vip.service';
import { loadAccountError, setAccount, setSecondaryStreamingSubscriptions, setSecondarySubscriptions } from '../state/actions';

type LoadAccountFromVipAccountInfoWorkflowParams = {
    accountNumber?: string;
    radioId?: string;
    lastName?: string;
    subscriptionId?: string;
};

@Injectable({ providedIn: 'root' })
export class LoadAccountFromVipAccountInfoWorkflowService
    implements DataWorkflow<{ params: LoadAccountFromVipAccountInfoWorkflowParams; allowErrorHandler: boolean }, boolean>
{
    constructor(private readonly _dataAccountVIPFlepzService: DataAccountVIPService, private _store: Store) {}

    build({ params, allowErrorHandler = true }) {
        return this._dataAccountVIPFlepzService.getAccountFromFlepzInfo(params, allowErrorHandler).pipe(
            tap((response) => {
                this._store.dispatch(setAccount({ account: response.nonPIIAccount }));
                this._store.dispatch(setSecondarySubscriptions({ secondarySubscriptions: response.eligibleSecondarySubscriptions }));
                this._store.dispatch(setSecondaryStreamingSubscriptions({ secondaryStreamingSubscriptions: response?.eligibleSecondaryStreamingSubscriptions }));
            }),
            mapTo(true),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
