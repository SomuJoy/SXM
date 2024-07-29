import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    RegisterAccountNonPiiWorkflowService,
    RegisterVerifyOptionsService,
    registerNonPiiResponseIsNullForAccountNumber,
    registerNonPiiResponseIsNullForRadioId
} from '@de-care/domains/account/state-account';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import {
    accountAlreadyRegistered,
    accountFoundCannotBeVerified,
    accountHasDemoSubscription,
    accountIsIdentifiedAndVerified,
    accountIsNOTAlreadyRegistered,
    accountResponseHasData,
    accountResponseHasNoData,
    doTwoFactorAuthOnAccountNotFound,
    fetchVerificationOptionsSettled,
    isInCNA,
    lpzVerificationFailed,
    lpzVerificationSuccess,
    setIsEmailAddressOnFileLookup,
    setIsPhoneNumberOnFileVerification,
    setLookupAccountByAccountNumberError,
    setLookupAccountByRadioIdError,
    setMaskedPhoneNumberLookup,
    setVerificationOptionsForNoAccountFound,
    submitLookupAccountByRadioIdOrAccountNumber,
    submitLookupAccountByRadioIdOrAccountNumberFailed,
    submitLookupAccountByRadioIdOrAccountNumberSuccess,
    twoFactorAuthCompleted,
    uiLookupModalClosed
} from './actions';
import { getFlepzSubmission, selectLast4DigitsOfAccountNumber, selectAccountRegisteredAndPreTrial, selectLookupErrors } from './selectors';
import { AccountVerificationStatusEnum, SubmitVerifyAccountWorkflow } from '@de-care/domains/account/state-two-factor-auth';

@Injectable()
export class LookupEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _registerAccountNonPiiWorkflow: RegisterAccountNonPiiWorkflowService,
        private readonly _registerVerifyOptionsService: RegisterVerifyOptionsService,
        private readonly _verifyAccountWorkflow: SubmitVerifyAccountWorkflow,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    lookup$ = createEffect(() =>
        this._actions$.pipe(
            ofType(submitLookupAccountByRadioIdOrAccountNumber),
            concatMap(({ radioId, accountNumber }) =>
                this._registerAccountNonPiiWorkflow.build({ radioId, accountNumber }).pipe(
                    map(response => accountResponseHasData({ response })),
                    catchError(({ error }) => of(submitLookupAccountByRadioIdOrAccountNumberFailed({ error: error })))
                )
            )
        )
    );

    registerNonPiiResponseIsNullForRadioIdRequest$ = createEffect(() =>
        this._actions$.pipe(
            ofType(registerNonPiiResponseIsNullForRadioId),
            map(() => accountResponseHasNoData({ radioID: true, accountNumber: false }))
        )
    );

    registerNonPiiResponseIsNullForAccountNumberRequest$ = createEffect(() =>
        this._actions$.pipe(
            ofType(registerNonPiiResponseIsNullForAccountNumber),
            map(() => accountResponseHasNoData({ radioID: false, accountNumber: true }))
        )
    );

    lookupByAccountNumberFailed$ = createEffect(() =>
        this._actions$.pipe(
            ofType(submitLookupAccountByRadioIdOrAccountNumberFailed),
            map(action => action?.error),
            filter(error => !!error),
            filter((error: any) => error.httpStatusCode === 400 || error.httpStatusCode === 500),
            filter(
                error =>
                    error?.error?.fieldErrors?.filter(x => x?.fieldName === 'accountNumber')?.length > 0 ||
                    error?.error?.errorStackTrace?.indexOf('Account ID is Invalid') !== -1
            ),
            map(() => setLookupAccountByAccountNumberError())
        )
    );

    lookupByRadioIdfailed$ = createEffect(() =>
        this._actions$.pipe(
            ofType(submitLookupAccountByRadioIdOrAccountNumberFailed),
            map(action => action?.error),
            filter(error => !!error),
            filter((error: any) => error.httpStatusCode === 400 || error.httpStatusCode === 500),
            filter(error => error?.error?.fieldErrors?.filter(x => x.fieldName === 'radioId').length > 0),
            map(() => setLookupAccountByRadioIdError())
        )
    );

    redirectToAccountAlreadyRegistered$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountResponseHasData),
            map(action => action.response),
            map(response =>
                response.accountProfile.accountRegistered && !response?.accountState?.isInPreTrial ? accountAlreadyRegistered() : accountIsNOTAlreadyRegistered({ response })
            )
        )
    );

    setMetaDataRegistration$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountIsNOTAlreadyRegistered),
            concatMap(action => [
                setIsEmailAddressOnFileLookup({ emailOnFile: action?.response?.hasEmailAddressOnFile }),
                setMaskedPhoneNumberLookup({ maskedPhoneNumber: action?.response?.maskedPhoneNumber }),
                setIsPhoneNumberOnFileVerification({ phoneOnFile: action?.response?.hasPhoneNumberOnFile })
            ])
        )
    );

    hasDemoSubscriptionCheck$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountIsNOTAlreadyRegistered),
            map(action => action.response),
            filter(response => !(!response?.accountProfile?.accountRegistered && response?.accountState?.isInPreTrial)),
            filter(response => response.hasDemoSubscription),
            map(() => accountHasDemoSubscription())
        )
    );

    lookupAccountByRadioIdOrAccountNumberIsNotAlreadyRegistered$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountIsNOTAlreadyRegistered),
            map(action => action.response),
            filter(response => !(!response.accountProfile.accountRegistered && response?.accountState?.isInPreTrial)),
            filter(response => !response.hasDemoSubscription),
            map(response =>
                submitLookupAccountByRadioIdOrAccountNumberSuccess({
                    isInPreTrial: response?.accountState?.isInPreTrial,
                    accountRegistered: response.accountProfile?.accountRegistered,
                    last4DigitsOfAccountNumber: response.last4DigitsOfAccountNumber
                })
            )
        )
    );

    handleInTheCNABeatTheSold$ = createEffect(() =>
        this._actions$.pipe(
            ofType(accountIsNOTAlreadyRegistered),
            map(action => action.response),
            filter(response => !response?.accountProfile?.accountRegistered && response?.accountState?.isInPreTrial),
            map(response =>
                isInCNA({
                    isInPreTrial: response?.accountState?.isInPreTrial,
                    last4DigitsOfAccountNumber: response.last4DigitsOfAccountNumber,
                    accountRegistered: response.accountProfile.accountRegistered
                })
            )
        )
    );

    redirectToCNA$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(isInCNA),
                tap(() => this._router.navigate(['account', 'registration', 'cna']))
            ),
        { dispatch: false }
    );

    handleLPZVerification$ = createEffect(() =>
        this._actions$.pipe(
            ofType(submitLookupAccountByRadioIdOrAccountNumberSuccess),
            withLatestFrom(this._store.select(getFlepzSubmission)),
            exhaustMap(([_, flepz]) =>
                this._verifyAccountWorkflow.build({ lpzVerificationRequest: { zipCode: flepz.zipCode, lastName: flepz.lastName, phoneNumber: flepz.phoneNumber } }).pipe(
                    map(response => (response.status === AccountVerificationStatusEnum.valid ? lpzVerificationSuccess() : lpzVerificationFailed())),
                    catchError(error => throwError(error))
                )
            )
        )
    );

    setVerificationOptions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(lpzVerificationFailed),
            withLatestFrom(this._store.select(selectLast4DigitsOfAccountNumber)),
            exhaustMap(([_, last4DigitsOfAccountNumber]) =>
                this._registerVerifyOptionsService.getVerifyOptions({ accountNumber: last4DigitsOfAccountNumber }).pipe(
                    map(({ canUsePhone, canUseRadioId, canUseAccountNumber }) =>
                        setVerificationOptionsForNoAccountFound({
                            verificationMethods: {
                                phone: { eligible: canUsePhone, verified: false },
                                radioId: { eligible: canUseRadioId, verified: false },
                                accountNumber: { eligible: canUseAccountNumber, verified: false }
                            }
                        })
                    )
                )
            )
        )
    );

    fetchVerificationOptionsSettles$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setVerificationOptionsForNoAccountFound),
            map(() => fetchVerificationOptionsSettled({ hasError: false }))
        )
    );

    handleLPZVerificationFailure$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setVerificationOptionsForNoAccountFound),
            map(({ verificationMethods }) => verificationMethods),
            map(({ accountNumber, radioId, phone }) =>
                !accountNumber.eligible && !radioId.eligible && !phone.eligible ? accountFoundCannotBeVerified() : doTwoFactorAuthOnAccountNotFound()
            )
        )
    );

    doTwoFactorAuth$ = createEffect(() =>
        this._actions$.pipe(
            ofType(twoFactorAuthCompleted),
            map(() => accountIsIdentifiedAndVerified())
        )
    );

    submitAccountLookupWorkflowResponseSuccess$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(accountIsIdentifiedAndVerified, lpzVerificationSuccess),
                withLatestFrom(this._store.select(selectAccountRegisteredAndPreTrial)),
                tap(([action, { accountRegistered, isInPreTrial }]) =>
                    accountRegistered
                        ? this._router.navigate(['account/registration/register'])
                        : isInPreTrial
                        ? this._router.navigate(['account/registration/cna'])
                        : this._router.navigate(['account/registration/register'])
                )
            ),
        { dispatch: false }
    );

    redirectUserIfNoAccountFoundAndUILookupModalClosed$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(uiLookupModalClosed),
                withLatestFrom(this._store.select(selectLookupErrors)),
                filter(([action, lookupErrors]) => lookupErrors?.accountFoundCannotBeVerified),
                tap(() => this._router.navigate(['account', 'registration']))
            ),
        { dispatch: false }
    );
}
