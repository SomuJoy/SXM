import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { UpdateSubscriptionNicknameWorkflowService } from '@de-care/domains/account/state-management';
import { concatMap, mapTo, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { patchNicknameBySubscriptionId } from '@de-care/domains/account/state-account';
import { getSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';

export interface SubscriptionNicknameWorkflowRequest {
    nickName: string;
    subscriptionId?: string;
    accountNumber?: string;
}
@Injectable({ providedIn: 'root' })
export class SubscriptionNicknameWorkflowService implements DataWorkflow<SubscriptionNicknameWorkflowRequest, boolean> {
    constructor(private readonly _updateSubscriptionNicknameService: UpdateSubscriptionNicknameWorkflowService, private readonly _store: Store) {}

    build(data: SubscriptionNicknameWorkflowRequest): Observable<boolean> {
        return this._store.select(getSelectedSubscriptionId).pipe(
            take(1),
            concatMap((subIdFromStore) => {
                const request = { ...data, subscriptionId: data.subscriptionId ?? subIdFromStore };
                return this._updateSubscriptionNicknameService.build(request).pipe(
                    tap(() => {
                        this._store.dispatch(patchNicknameBySubscriptionId({ subscriptionId: request.subscriptionId, nickname: data.nickName }));
                    })
                );
            }),
            mapTo(true)
        );
    }
}
