import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountProfileService, getAccountEmail, getAccountRadioServiceRadioIdLast4, RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { AuthenticationWorkflowService } from '@de-care/domains/account/state-login';
import { UserNameValidationWorkFlow } from '@de-care/domains/customer/state-customer-verification';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
    accountRegisteredSuccess,
    fetchVerificationOptions,
    fetchVerificationOptionsForOneAccountFound,
    registerAccount,
    setEmailFromAccount,
    setLast4DigitsOfRadioId,
    userNameValidated,
    validateUserName,
    getAccountProfile,
    getAccountProfileSuccess,
    setIsEmailEligibleForUserName,
    registrationDataReady,
    setEmailOnAccountFromConfirmation,
    setRegistrationUsernameError,
    setRegistrationSystemError,
    setRegistrationPasswordContainsPiiData,
    setRegistrationPasswordInvalid,
} from './actions';
import {
    getCNAFormDataAndEmail,
    getLast4AccountAndRadioId,
    getAccountProfileRequest,
    getEmailAndIsEmailEligibleForUserName,
    getIsInBeatTheSoldScenario,
    getUserNameAndNuDetectDataForLoginAndIsStepUp,
    getPlainCustomersPlansList,
} from './selectors';
import { TranslateService } from '@ngx-translate/core';
import { behaviorEventReactionPlanNamesForRegistration } from '@de-care/shared/state-behavior-events';
import { throwError } from 'rxjs';
@Injectable()
export class RegistrationEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _registerAccountWorkflow: RegisterWorkflowService,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _userNameValidationWorkFlow: UserNameValidationWorkFlow,
        private readonly _accountProfileService: AccountProfileService,
        private readonly _authenticationTokensWorflow: AuthenticationWorkflowService,
        private readonly _translateService: TranslateService
    ) {}

    validateUsernameReuse$ = createEffect(() =>
        this._actions$.pipe(
            ofType(validateUserName),
            withLatestFrom(this._store.select(getEmailAndIsEmailEligibleForUserName)),
            filter(([action, { isEmailEligibleForUserName }]) => isEmailEligibleForUserName),
            map(([action, { email }]) => email),
            concatMap((userName) => this._userNameValidationWorkFlow.build({ reuseUserName: true, userName }).pipe(map((valid) => setIsEmailEligibleForUserName({ valid }))))
        )
    );

    validateUserNameFromConfirmationEmail$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setEmailOnAccountFromConfirmation),
            map((action) => action.email),
            concatMap((userName) => this._userNameValidationWorkFlow.build({ reuseUserName: true, userName }).pipe(map((valid) => setIsEmailEligibleForUserName({ valid }))))
        )
    );

    userNameValidated$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setIsEmailEligibleForUserName),
            map(() => userNameValidated())
        )
    );

    markFormIsReadyWhenInBeatTheSoldAfterUserNameValidated$ = createEffect(() =>
        this._actions$.pipe(
            ofType(userNameValidated),
            withLatestFrom(this._store.select(getIsInBeatTheSoldScenario)),
            filter(([action, beatTheSold]) => beatTheSold),
            map(() => registrationDataReady())
        )
    );

    registerAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(registerAccount),
            withLatestFrom(this._store.pipe(select(getCNAFormDataAndEmail))),
            switchMap(([action, { cnaData, email }]) =>
                this._registerAccountWorkflow
                    .build({
                        registrationData: {
                            userName: !!action.loginCredentials.email ? action.loginCredentials.email : email,
                            password: action.loginCredentials.password,
                            securityQuestions: action.securityQuestionsData,
                            cna: !!cnaData
                                ? {
                                      firstName: cnaData.firstName,
                                      lastName: cnaData.lastName,
                                      email: cnaData.email,
                                      phone: cnaData.phone,
                                      address: {
                                          avsvalidated: cnaData.avsvalidated,
                                          serviceAddress: cnaData.serviceAddress,
                                          streetAddress: cnaData.addressLine1,
                                          city: cnaData.city,
                                          state: cnaData.state,
                                          postalCode: cnaData.zip,
                                      },
                                  }
                                : !!(action?.emailData?.email || action?.phoneNumberData?.phoneNumber)
                                ? {
                                      email: action?.emailData?.email,
                                      phone: action?.phoneNumberData?.phoneNumber,
                                  }
                                : null,
                        },
                    })
                    .pipe(
                        map(
                            (data) =>
                                data.status === 'SUCCESS' &&
                                accountRegisteredSuccess({
                                    loginCredentials: {
                                        password: action.loginCredentials.password,
                                        username: action.loginCredentials?.email || action?.emailData?.email,
                                    },
                                })
                        ),
                        catchError((err) => {
                            if (err === 'USERNAME_ERROR') {
                                this._store.dispatch(setRegistrationUsernameError());
                            } else if (err === 'PASSWORD_HAS_PII_DATA') {
                                this._store.dispatch(setRegistrationPasswordContainsPiiData());
                            } else if (err === 'INVALID_PASSWORD') {
                                this._store.dispatch(setRegistrationPasswordInvalid());
                            } else {
                                this._store.dispatch(setRegistrationSystemError());
                            }
                            return throwError(err);
                        })
                    )
            )
        )
    );

    getAuthenticationTokens$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(accountRegisteredSuccess),
                map((action) => action.loginCredentials),
                withLatestFrom(this._store.pipe(select(getUserNameAndNuDetectDataForLoginAndIsStepUp))),
                filter(([action, { isInStepUp }]) => !isInStepUp),
                switchMap(([credentials, { userNameForLogin, userBehaviorPayloadForLogin }]) =>
                    this._authenticationTokensWorflow.build({
                        token: { password: credentials.password, username: credentials.username || userNameForLogin },
                        environmentData: {
                            userBehaviorPayload: userBehaviorPayloadForLogin,
                        },
                        client: 'PHX',
                    })
                )
            ),
        { dispatch: false }
    );

    accountRegistrationSuccess$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(accountRegisteredSuccess),
                map(() => this._router.navigate(['account/registration/completed']))
            ),
        { dispatch: false }
    );

    populateEmailInRegisterState$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getAccountProfileSuccess),
            withLatestFrom(this._store.pipe(select(getAccountEmail))),
            map(([_, email]) => email),
            filter((email) => !!email),
            map((email) => setEmailFromAccount({ email }))
        )
    );

    setLastFourDigitsRadioIdFromNonPii$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getAccountProfileSuccess),
            withLatestFrom(this._store.pipe(select(getAccountRadioServiceRadioIdLast4))),
            map(([_, last4RadioId]) => setLast4DigitsOfRadioId({ last4RadioId }))
        )
    );

    setLastFourDigitsRadioIdFromFlepz$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound),
            withLatestFrom(this._store.pipe(select(getLast4AccountAndRadioId))),
            map(([account, accAndRidList]) =>
                accAndRidList?.filter((accAndRid) => accAndRid.accLast4 === account.last4DigitsOfAccountNumber)?.map((result) => result.ridLast4)
            ),
            filter((ridFound) => ridFound && ridFound.length > 0),
            map((rid) => setLast4DigitsOfRadioId({ last4RadioId: rid[0] }))
        )
    );

    callAccountProfile$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getAccountProfile),
            withLatestFrom(this._store.select(getAccountProfileRequest)),
            map(([action, request]) => request),
            concatMap(({ last4DigitsOfAccountNumber: accountNumber }) =>
                this._accountProfileService.getAccountProfile({ accountNumber }).pipe(map((response) => getAccountProfileSuccess({ response })))
            )
        )
    );

    registrationDataReady$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getAccountProfileSuccess),
            map(() => registrationDataReady())
        )
    );

    setPlanNamesForAnalyticsTracking$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound),
            withLatestFrom(this._store.select(getPlainCustomersPlansList)),
            map(([action, list]) => list?.filter((accItem) => accItem?.accountLast4Digits === action?.last4DigitsOfAccountNumber)),
            map((accItem) => accItem?.map((items) => items?.plan)),
            map((plans) => plans?.reduce((accumulator, value) => accumulator?.concat(value), [])),
            map((flattenedPlans) => flattenedPlans?.map((plan) => this._translateService.instant('app.packageDescriptions.' + plan + '.name'))),
            map((planNamesArray) => planNamesArray?.join(';')),
            map((planNames) => behaviorEventReactionPlanNamesForRegistration({ planNames }))
        )
    );
}
