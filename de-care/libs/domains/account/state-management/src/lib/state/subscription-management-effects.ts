import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { ModifySubscriptionOptionsService } from '../data-services/modify-subscription-options.service';
import { setModifySubscriptionOptions } from './actions';
import { loadModifySubscriptionOptionsForSubscriptionId } from './public.actions';

@Injectable()
export class SubscriptionManagementEffects {
    constructor(private readonly _actions$: Actions, private readonly _modifySubscriptionOptionsService: ModifySubscriptionOptionsService) {}

    loadSubscriptionOptionsForId$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadModifySubscriptionOptionsForSubscriptionId),
            switchMap(({ subscriptionId }) =>
                this._modifySubscriptionOptionsService.getSubscriptionOptions({ subscriptionId }).pipe(
                    map((res) => {
                        return setModifySubscriptionOptions({
                            subscriptionId,
                            modifySubscriptionOptions: { options: res },
                        });
                    })
                )
            )
        )
    );
}
