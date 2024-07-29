import { Injectable } from '@angular/core';
import { behaviorEventReactionActiveSubscriptionPlanCodes } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Subscription } from '../data-services/account.interface';
import { DataAccountRegisterNonPiiService, RegisterNonPiiRequest, RegisterNonPiiResponse } from '../data-services/data-account-register-non-pii.service';
import { registerNonPiiResponseIsNullForAccountNumber, registerNonPiiResponseIsNullForRadioId } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class RegisterAccountNonPiiWorkflowService implements DataWorkflow<RegisterNonPiiRequest, RegisterNonPiiResponse> {
    constructor(private readonly _dataAccountRegisterNonPiiService: DataAccountRegisterNonPiiService, private readonly _store: Store) {}

    build(request: RegisterNonPiiRequest): Observable<RegisterNonPiiResponse> {
        return this._dataAccountRegisterNonPiiService.getRegisterNon(request).pipe(
            tap((response) => !!!response && this._handleNullResponse(request)),
            tap(({ subscriptions }) => {
                if (subscriptions) {
                    this._handleBehaviorEventForActiveSubscriptions(subscriptions);
                }
            })
        );
    }

    private _handleBehaviorEventForActiveSubscriptions(subscriptions: Subscription[]): void {
        const plans = subscriptions[0]?.plans?.map((plan) => ({ code: plan.code }));
        this._store.dispatch(behaviorEventReactionActiveSubscriptionPlanCodes({ plans }));
    }

    private _handleNullResponse(request: RegisterNonPiiRequest): void {
        !!request.accountNumber ? this._store.dispatch(registerNonPiiResponseIsNullForAccountNumber()) : this._store.dispatch(registerNonPiiResponseIsNullForRadioId());
    }
}
