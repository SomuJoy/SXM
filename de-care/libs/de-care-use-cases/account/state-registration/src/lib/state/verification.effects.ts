import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { RegisterAccountNonPiiWorkflowService, RegisterVerifyOptionsService } from '@de-care/domains/account/state-account';
import {
    accountAlreadyRegistered,
    accountIsInStepUpScenario,
    fetchVerificationOptions,
    fetchVerificationOptionsForOneAccountFound,
    fetchVerificationOptionsSettled,
    fetchVerificationOptionsWhenInStepUpFlow,
    getVerificationOptionsForUnregisteredAccount,
    setFirstName,
    setIsEmailAddressOnFileVerification,
    setIsPhoneNumberOnFileVerification,
    setLast4DigitsOfAccountNumber,
    setMaskedPhoneNumberVerification,
    setUserName,
    setVerificationMethods,
} from './actions';
import { getCustomerAccountsFirstSubscriptionPlanCodes } from './selectors';
import { previouslyRegisteredStatusDetermined } from './verification-effects.actions';
import { behaviorEventReactionVerificationMethods, behaviorEventReactionActiveSubscriptionPlanCodes } from '@de-care/shared/state-behavior-events';

@Injectable()
export class VerificationEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _registerVerifyOptionsService: RegisterVerifyOptionsService,
        private readonly _registerNonPiiService: RegisterAccountNonPiiWorkflowService,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    determineIfAlreadyRegistered$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound),
            concatMap(({ last4DigitsOfAccountNumber }) => this._getNonPii(last4DigitsOfAccountNumber))
        )
    );

    trackPlanCodeFromFlepzResponse$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound),
            withLatestFrom(this._store.pipe(select(getCustomerAccountsFirstSubscriptionPlanCodes))),
            map(([action, data]) => this._getPlansFromAccountInfo(action.last4DigitsOfAccountNumber, data)),
            map((plans) => behaviorEventReactionActiveSubscriptionPlanCodes({ plans }))
        )
    );

    fetchVerificationOptionsWhenInStepUp$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountIsInStepUpScenario),
            map((action) => action.response),
            map(({ last4DigitsOfAccountNumber }) => getVerificationOptionsForUnregisteredAccount({ last4DigitsOfAccountNumber }))
        )
    );

    handleAlreadyRegistered$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound, fetchVerificationOptionsWhenInStepUpFlow),
            concatMap(() => this._actions$.pipe(ofType(previouslyRegisteredStatusDetermined), take(1))),
            filter(({ previouslyRegistered }) => previouslyRegistered),
            map(() => accountAlreadyRegistered())
        );
    });

    handleUnregisteredAccount$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound, fetchVerificationOptionsWhenInStepUpFlow),
            concatMap(({ last4DigitsOfAccountNumber }) =>
                this._actions$.pipe(
                    ofType(previouslyRegisteredStatusDetermined),
                    take(1),
                    map(({ previouslyRegistered }) => ({ last4DigitsOfAccountNumber, previouslyRegistered }))
                )
            ),
            filter(({ previouslyRegistered }) => !previouslyRegistered),
            map(({ last4DigitsOfAccountNumber }) => getVerificationOptionsForUnregisteredAccount({ last4DigitsOfAccountNumber }))
        );
    });

    fetchVerificationOptionsForUnregisteredAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getVerificationOptionsForUnregisteredAccount),
            concatMap(({ last4DigitsOfAccountNumber }) => this._getVerifyOptions(last4DigitsOfAccountNumber))
        )
    );

    redirectAlreadyRegistered$ = createEffect(
        () => {
            return this._actions$.pipe(
                ofType(accountAlreadyRegistered),
                tap(() => {
                    this._router.navigate(['/account/registration/registered']);
                })
            );
        },
        { dispatch: false }
    );

    trackVerificationOptions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setVerificationMethods),
            map((action) => action.verificationMethods),
            map((methods) => Object.keys(methods).filter((key) => methods[key].eligible && !methods[key].verified)),
            map((methodKeys) => methodKeys.map((m) => (m === 'phone' ? (m = 'text ') : m))),
            map((methodsArray) => behaviorEventReactionVerificationMethods({ verificationOptions: methodsArray }))
        )
    );

    private _getNonPii(last4DigitsOfAccountNumber: string) {
        // TODO: move this into workflow, not direct service call, set domain state
        return this._registerNonPiiService.build({ accountNumber: last4DigitsOfAccountNumber }).pipe(
            flatMap((accountInfo) => {
                return [
                    setUserName({ userName: accountInfo?.userName ?? null }),
                    setFirstName({ firstName: accountInfo?.firstName ?? null }),
                    setIsEmailAddressOnFileVerification({ emailOnFile: accountInfo?.hasEmailAddressOnFile }),
                    setIsPhoneNumberOnFileVerification({ phoneOnFile: accountInfo?.hasPhoneNumberOnFile }),
                    setMaskedPhoneNumberVerification({ maskedPhoneNumber: accountInfo?.maskedPhoneNumber }),
                    previouslyRegisteredStatusDetermined({ previouslyRegistered: accountInfo?.accountProfile?.accountRegistered === true }),
                    setLast4DigitsOfAccountNumber({ last4DigitsOfAccountNumber: accountInfo?.last4DigitsOfAccountNumber }),
                ];
            }),
            catchError(() => of(fetchVerificationOptionsSettled({ hasError: true })))
        );
    }

    private _getVerifyOptions(last4DigitsOfAccountNumber: string) {
        return this._registerVerifyOptionsService.getVerifyOptions({ accountNumber: last4DigitsOfAccountNumber }).pipe(
            concatMap(({ canUsePhone, canUseRadioId, canUseAccountNumber }) => [
                setVerificationMethods({
                    verificationMethods: {
                        phone: { eligible: canUsePhone, verified: false },
                        radioId: { eligible: canUseRadioId, verified: false },
                        accountNumber: { eligible: canUseAccountNumber, verified: false },
                    },
                }),
                fetchVerificationOptionsSettled({ hasError: false }),
            ]),
            catchError(() => of(fetchVerificationOptionsSettled({ hasError: true })))
        );
    }

    private _getPlansFromAccountInfo(accNumber: string, data: { accountLast4Digits: string; plans: { code: string }[] }[]) {
        const accountsFound = data && data?.length > 0 ? data.filter((acc) => acc.accountLast4Digits === accNumber) : null;
        const account = accountsFound && Array.isArray(accountsFound) && accountsFound.length > 0 ? accountsFound[0] : null;
        return account ? account.plans : null;
    }
}
