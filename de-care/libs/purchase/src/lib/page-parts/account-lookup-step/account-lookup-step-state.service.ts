import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { AccountLookupStepComplete, StepCompleteReasonEnum } from './account-lookup-step.component';
import { IdentityLookupPhoneOrEmailResponseModel, PlanTypeEnum, YourSubscriptionOptions, SubscriptionActionTypeEnum } from '@de-care/data-services';
import { AccountLookupOutput } from '@de-care/identification';

export interface AccountLookupStepState extends AccountLookupOutput {
    completeReason: null | StepCompleteReasonEnum;
    selectedSubscription: IdentityLookupPhoneOrEmailResponseModel;
}

@Injectable()
export class AccountLookupStepStateService {
    private _initialState: AccountLookupStepState = {
        attemptedEmail: '',
        emailValid: false,
        selectedSubscription: null,
        completeReason: null,
        accountData: []
    };

    private _state = this._initialState;
    private _store$ = new BehaviorSubject<AccountLookupStepState>(this._state);

    completeReason$ = this._store$.pipe(map(state => state.completeReason, distinctUntilChanged()));

    accountData$: Observable<IdentityLookupPhoneOrEmailResponseModel[]> = this._store$.pipe(map(state => state.accountData, distinctUntilChanged()));

    hasQualifyingSubscriptions$: Observable<boolean> = this._store$.pipe(
        map(state => {
            const countQualifiyingSubscriptions = this._countQualifyingSubscriptions(state.accountData);
            return countQualifiyingSubscriptions.length > 0;
        })
    );

    hasOneOfferedSubscription$: Observable<boolean> = this._store$.pipe(
        map(state => {
            const countOfferedSubscriptions = this._countOfferedSubscriptions(state.accountData).length;
            const countQualifiyingSubscriptions = this._countQualifyingSubscriptions(state.accountData).length;
            if (countOfferedSubscriptions === 1 && countQualifiyingSubscriptions === 1) {
                return true;
            }
            return false;
        })
    );

    // remove item.streamingService.randomCredentials  from filter to support post-MVP feature of "create login" on accounts without login credentials
    streamingSubscriptions$: Observable<YourSubscriptionOptions> = this._store$.pipe(map(state => this._getQualifyingSubscriptions(state.accountData)));

    stepInfo$: Observable<AccountLookupStepComplete> = this._store$.pipe(
        map(state => {
            return <AccountLookupStepComplete>{
                attemptedEmail: state.attemptedEmail,
                emailValid: state.emailValid,
                completeReason: state.completeReason,
                accountData: state.accountData,
                selectedSubscription: state.selectedSubscription
            };
        })
    );

    constructor() {}

    updateStateData(data: any) {
        this._updateState({ ...this._state, ...data });
    }

    private _getQualifyingSubscriptions(accountData: IdentityLookupPhoneOrEmailResponseModel[]): YourSubscriptionOptions {
        const currentSubscriptions = accountData.filter(item => {
            return (
                item.streamingService &&
                item.streamingService.status === 'Active' &&
                (item.radioService || item.followonPlans.length > 0 || (item.plans && item.plans.length > 0 && item.plans[0].type === PlanTypeEnum.SelfPaid))
            );
        });
        const offeredSubscriptions = accountData.filter(item => {
            return (
                item.streamingService &&
                !item.radioService &&
                item.plans &&
                item.plans.length > 0 &&
                (item.plans && item.plans.length > 0 ? item.plans[0].type === PlanTypeEnum.Trial : false) &&
                item.followonPlans.length === 0
            );
        });

        currentSubscriptions.forEach(current => (current.subActionType = SubscriptionActionTypeEnum.SIGN_IN));
        offeredSubscriptions.forEach(offered => (offered.subActionType = SubscriptionActionTypeEnum.ADD_SUB));

        return { currentSubscriptions, offeredSubscriptions };
    }

    private _countQualifyingSubscriptions(accountData: IdentityLookupPhoneOrEmailResponseModel[]): IdentityLookupPhoneOrEmailResponseModel[] {
        return accountData.filter(item => !!item.streamingService);
    }

    private _countOfferedSubscriptions(accountData: IdentityLookupPhoneOrEmailResponseModel[]): IdentityLookupPhoneOrEmailResponseModel[] {
        return accountData.filter(item => {
            return (
                item.streamingService &&
                !item.radioService &&
                (item.plans && item.plans.length > 0 ? item.plans[0].type === PlanTypeEnum.Trial : false) &&
                item.followonPlans.length === 0
            );
        });
    }

    private _updateState(state: AccountLookupStepState) {
        this._store$.next((this._state = state));
    }
}
