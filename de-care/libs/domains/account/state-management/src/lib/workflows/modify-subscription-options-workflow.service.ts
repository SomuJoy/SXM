import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { ModifySubscriptionOptionsRequest, ModifySubscriptionOptionsService } from '../data-services/modify-subscription-options.service';
import { setModifySubscriptionOptions } from '../state/actions';
import { Store } from '@ngrx/store';

export interface ModifySubscriptionOptionsResponse {
    options: options[];
    cancelSubscriptionOptionInfo: {
        showViewOffer: boolean;
        showTransferRadio: boolean;
        showCancelOnline: boolean;
        showCancelViaChat: boolean;
        triggeredRuleId: string | number;
    };
}
type options = 'CHANGE_PLAN' | 'CHANGE_TERM' | 'REFRESH_RADIO' | 'DOWNLOAD_MANUAL' | 'REPLACE_RADIO' | 'TRANSFER_SUBSCRIPTION' | 'CANCEL_SUBSCRIPTION';

@Injectable({ providedIn: 'root' })
export class ModifySubscriptionOptionsWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _modifySubscriptionOptionsService: ModifySubscriptionOptionsService, private readonly _store: Store) {}

    build(request: ModifySubscriptionOptionsRequest): Observable<boolean> {
        return this._modifySubscriptionOptionsService.getSubscriptionOptions(request).pipe(
            map((res) => {
                this._store.dispatch(
                    setModifySubscriptionOptions({
                        subscriptionId: request.subscriptionId,
                        modifySubscriptionOptions: { options: res },
                    })
                );
            }),
            mapTo(true)
        );
    }

    // TODO: add error catch to send behavior event
}
