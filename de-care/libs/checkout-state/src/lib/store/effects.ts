// ===============================================================================
// Angular
import { Injectable, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

// ===============================================================================
// Libs
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { of, from, Observable, throwError, iif } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom, tap, filter, flatMap, take, mapTo } from 'rxjs/operators';

// ===============================================================================
// Imported Features (Core)
import { CoreLoggerService, DataLayerService } from '@de-care/data-layer';

//================================================================================
// Imported Services
// import { DataCheckoutService, DataAccountService } from '../../data-services';

// ===============================================================================
// Imported Features (Data Services)
// import { AccountModel } from '../../data-services';

//================================================================================
// Internal Features (Store)
import * as CheckoutActions from './actions';
import { getIsRtc } from './rtc.selectors';
import { getCheckoutAccount, getCheckoutState, getIsStudentFlow, getIsPickAPlanOrganic, getPickAPlanSelectedOfferPackageName } from './selectors';
import {
    AccountModel,
    OfferModel,
    PackageModel,
    DataAccountService,
    DataOfferService,
    DataLayerDataTypeEnum,
    SubscriptionModel,
    DataRegisterService,
    RadioStatusEnum,
    CustomEventNameEnum,
    RegisterPasswordError,
    ComponentNameEnum,
    IdentityRequestModel,
    IdentityFlepzRequestModel,
    DataIdentityRequestStoreService,
    EventErrorEnum,
    getRadioIdOnAccount,
    getSubscriptionIdFromAccount,
    OfferNotAvailableReasonEnum,
    FlowNameEnum,
    normalizeAccountNumber,
    TokenPayloadType,
    OfferCustomerDataModel,
    getStateForServiceAddress,
} from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';

import { NonPiiLookupWorkflow, AccountFromTokenWorkflow } from '@de-care/data-workflows';
import { UrlHelperService } from '@de-care/app-common';
import { setFirstName, setLastName, setEmail } from '@de-care/customer-state';
import { DOCUMENT } from '@angular/common';
import { LoadFollowOnOffersForStreamingWorkflowService } from '@de-care/domains/offers/state-follow-on-offers';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import {
    behaviorEventErrorFromBusinessLogic,
    behaviorEventReactionForSuccessfulRegistration,
    behaviorEventReactionForFailedRegistration,
} from '@de-care/shared/state-behavior-events';
import { getAllOffers, Offer } from '@de-care/domains/offers/state-offers';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';

//********************************************************************************
@Injectable()
export class StoreCheckoutsEffects {
    //================================================
    //===                Variables                 ===
    //================================================
    private _logPrefix: string = '[StoreCheckoutsEffects]:';
    private _comingAccount: AccountModel;
    private _comingOffer: OfferModel;
    private _radioId: string;
    private _programCode: string;
    private _tbView: string;
    private _isTokenizedLink: boolean;
    private _isStreaming: boolean;

    private _offerNotAvailableReason: OfferNotAvailableReasonEnum;

    private readonly _window: Window;

    //================================================
    //===               Constructor                ===
    //================================================
    constructor(
        private _actions$: Actions,
        private _dataAccountSvc: DataAccountService,
        private _registerService: DataRegisterService,
        private _dataOfferSvc: DataOfferService,
        private _store: Store,
        private _dataLayerSrv: DataLayerService,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _accountTokenSrv: AccountFromTokenWorkflow,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _router: Router,
        private _env: SettingsService,
        private route: ActivatedRoute,
        private _urlHelperService: UrlHelperService,
        private _appSettings: SettingsService,
        private _userSettings: UserSettingsService,
        private _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService,
        private readonly _logger: CoreLoggerService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _loadFollowOnOffersForStreamingWorkflowService: LoadFollowOnOffersForStreamingWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {
        this._window = _document.defaultView;
        this._logger.debug(`${this._logPrefix} Constructor(). Loading Service.`);
    }

    //================================================
    //===              Public Effects              ===
    //================================================

    @Effect()
    loadCheckout$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.LoadCheckout),
        map((action) => ({
            token: action.payload.token,
            accountNumber: action.payload.accountNumber,
            account: action.payload.account,
            isStreaming: action.payload.isStreaming,
            radioId: action.payload.radioId,
            lastName: action.payload.lastName,
            programCode: action.payload.programId,
            marketingPromoCode: action.payload.marketingPromoCode,
            renewalCode: action.payload.renewalCode,
            tbView: action.payload.tbView,
            canUpdateUseCase: !action.payload.proactiveFlow && !action.payload.isStreaming,
            isIdentifiedUser: action.payload.isIdentifiedUser,
            tokenType: action.payload.tokenType,
        })),
        concatMap((data) =>
            iif(
                () => data.canUpdateUseCase,
                this._updateUsecaseWorkflowService.build({ useCase: 'SATELLITE_TARGETED', identifiedUser: data.isIdentifiedUser }).pipe(map(() => data)),
                of(data)
            )
        ),
        withLatestFrom(this._store.pipe(select(getIsRtc)), this._store.pipe(select(getIsPickAPlanOrganic)), this._store.pipe(select(getPickAPlanSelectedOfferPackageName))),
        concatMap(([params, isRtc, isPickAPlanOrganic, pickAPlanSelectedOfferPackageName]) => {
            this._programCode = params.programCode || null;
            this._tbView = params.tbView || null;
            if (!params.token && (!params.radioId || (params.radioId && !(params.accountNumber || params.lastName))) && !isPickAPlanOrganic && !params.isIdentifiedUser) {
                let error: Error = new Error('Invalid route params supplied.');
                if (!params.radioId) {
                    error = new Error(EventErrorEnum.InvalidRadioID);
                } else if (!(params.accountNumber || params.lastName)) {
                    error = new Error(EventErrorEnum.InvalidActNumOrLastName);
                }
                throw error;
            }
            this._isTokenizedLink = !!params.token;
            let obs$: Observable<AccountModel>;

            if (params.isStreaming && params.account) {
                obs$ = of(params.account);
            } else if (isRtc || (pickAPlanSelectedOfferPackageName && !isPickAPlanOrganic && !this._isTokenizedLink)) {
                obs$ = this._store.pipe(select(getCheckoutAccount), take(1));
            } else if (params.accountNumber) {
                const parsedAccountNum = normalizeAccountNumber(params.accountNumber);
                const last4DigitsOfAccount = parsedAccountNum.substring(parsedAccountNum.length - 4);
                obs$ = this._nonPiiSrv
                    .build({
                        accountNumber: last4DigitsOfAccount,
                        radioId: params.radioId,
                    })
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                            if (error.status === 400) {
                                let appError: Error = new Error('Invalid route params supplied.');
                                if (this._hasFieldError(error, 'radioId')) {
                                    appError = new Error(EventErrorEnum.InvalidRadioID);
                                } else if (this._hasFieldError(error, 'accountNumber')) {
                                    appError = new Error(EventErrorEnum.InvalidAccountNumber);
                                } else if (this._hasFieldError(error, 'lastName')) {
                                    appError = new Error(EventErrorEnum.InvalidLastName);
                                }
                                return throwError(appError);
                            } else {
                                return throwError(error);
                            }
                        })
                    );
            } else if (params.isIdentifiedUser && params.radioId) {
                const last4DigitsOfRadioId = params.radioId.substring(params.radioId.length - 4);
                obs$ = this._nonPiiSrv
                    .build({
                        radioId: last4DigitsOfRadioId,
                        identifiedUser: params.isIdentifiedUser,
                    })
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                            if (error.status === 400) {
                                let appError: Error = new Error('Invalid route params supplied.');
                                if (this._hasFieldError(error, 'radioId')) {
                                    appError = new Error(EventErrorEnum.InvalidRadioID);
                                }
                                return throwError(appError);
                            } else {
                                return throwError(error);
                            }
                        })
                    );
            } else if (params.lastName) {
                obs$ = this._nonPiiSrv
                    .build({
                        radioId: params.radioId,
                        lastName: params.lastName,
                    })
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                            if (error.status === 400) {
                                let appError: Error = new Error('Invalid route params supplied.');
                                if (this._hasFieldError(error, 'radioId')) {
                                    appError = new Error(EventErrorEnum.InvalidRadioID);
                                } else if (this._hasFieldError(error, 'lastName')) {
                                    appError = new Error(EventErrorEnum.InvalidLastName);
                                }
                                return throwError(appError);
                            } else {
                                return throwError(error);
                            }
                        })
                    );
            } else if (params.radioId && isPickAPlanOrganic) {
                obs$ = of(this.createNewAccount(params.radioId));
            } else {
                obs$ = this._accountTokenSrv
                    .build({
                        token: params.token,
                        tokenType: params.tokenType ? params.tokenType : TokenPayloadType.SalesAudio,
                    })
                    .pipe(
                        map((response) => {
                            if (params.tokenType === TokenPayloadType.Account && response.nonPIIAccount?.subscriptions?.length !== 1) {
                                throw new Error(EventErrorEnum.InvalidToken);
                            }
                            return response.nonPIIAccount;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            if (error.status === 404) {
                                let appError: Error = new Error('Invalid route params supplied.');
                                if (this._hasFieldError(error, 'token')) {
                                    appError = new Error(EventErrorEnum.InvalidToken);
                                }
                                return throwError(appError);
                            } else if (error.status === 400) {
                                let appError: Error = new Error('Invalid route params supplied.');
                                if (this._hasFieldError(error, 'token')) {
                                    appError = new Error(EventErrorEnum.InvalidToken);
                                } else if (this._hasFieldError(error, 'lastName')) {
                                    appError = new Error(EventErrorEnum.InvalidToken);
                                }
                                return throwError(appError);
                            } else {
                                return throwError(error);
                            }
                        })
                    );
            }
            return obs$.pipe(
                filter((account) => {
                    if (this._dataAccountSvc.accountHasActiveSubscription(account.subscriptions[0])) {
                        this._store.dispatch(
                            CheckoutActions.SetAccountActiveSubscription({
                                payload: {
                                    subscription: account.subscriptions[0],
                                    programCode: this._programCode,
                                },
                            })
                        );
                        return false;
                    }
                    return true;
                }),
                withLatestFrom(this._store.pipe(select(getIsStudentFlow)), this._userSettings.selectedCanadianProvince$),
                concatMap(([account, isStudent, selectedProvince]) => {
                    this._comingAccount = account;

                    const hasSubscriptions = account.subscriptions && account.subscriptions.length > 0;

                    if (!params.isStreaming) {
                        this._radioId = getRadioIdOnAccount(account);
                    }

                    if (hasSubscriptions) {
                        this._buildDataLayerPlanInfo();
                    }
                    this._dataLayerSrv.update(DataLayerDataTypeEnum.AccountData, account);
                    const state = getStateForServiceAddress(account);
                    const dataOfferParams: OfferCustomerDataModel = {
                        radioId: !params.isStreaming ? this._radioId : undefined,
                        streaming: params.isStreaming,
                        subscriptionId: params.isStreaming ? getSubscriptionIdFromAccount(account) : undefined,
                        marketingPromoCode: params.marketingPromoCode || undefined,
                        programCode: this._programCode || undefined,
                        province: this._appSettings.isCanadaMode ? (state ? state : selectedProvince) : undefined,
                        ...(isStudent ? { student: true } : {}),
                    };

                    //validating marketing promo code
                    if (dataOfferParams.marketingPromoCode) {
                        return this._dataOfferSvc.validatePromoCode({ marketingPromoCode: dataOfferParams.marketingPromoCode }).pipe(
                            concatMap((data) => {
                                if (data.status !== 'SUCCESS') {
                                    delete dataOfferParams.marketingPromoCode;
                                    this.handleInvalidPromo(null);
                                }
                                this._store.dispatch(CheckoutActions.setIsPromoCodeValid({ isValid: data.status === 'SUCCESS' }));
                                return this._dataOfferSvc.customer(dataOfferParams).pipe(
                                    catchError((error) => {
                                        return throwError({ customerException: true, exception: error });
                                    })
                                );
                            }),
                            catchError((data) => {
                                if (!data.customerException && data.status === 400) {
                                    delete dataOfferParams.marketingPromoCode;
                                    this.handleInvalidPromo(data.error);
                                    return this._dataOfferSvc.customer(dataOfferParams);
                                } else {
                                    return throwError(data);
                                }
                            })
                        );
                    }

                    if (params.isStreaming && account && account.isNewAccount) {
                        return this._dataOfferSvc.customer(dataOfferParams);
                    }
                    return this._dataOfferSvc.customer(dataOfferParams);
                }),
                tap((offerModel: OfferModel) => {
                    this._comingOffer = offerModel;
                    const offer = (this._comingOffer.offers || [])[0] || null;
                    this.handleFallbackCheck(offer);
                    if (this._isTokenizedLink) {
                        this._buildDataLayerDeviceInfo(this._programCode);
                    }
                    this._buildDataLayerPageInfo4OfferRedirect();
                    this._dataLayerSrv.update(DataLayerDataTypeEnum.OfferData, offerModel);
                    this._dispatchOffersDataEvent();
                }),
                withLatestFrom(this._store.pipe(select(getCheckoutState)), this._userSettings.selectedCanadianProvince$),
                flatMap(([offerModel, state, selectedProvince]) => {
                    if (pickAPlanSelectedOfferPackageName) {
                        const selectedOfferPosition = offerModel.offers.findIndex((o) => o.packageName === pickAPlanSelectedOfferPackageName);
                        [offerModel.offers[0], offerModel.offers[selectedOfferPosition]] = [offerModel.offers[selectedOfferPosition], offerModel.offers[0]];
                    }
                    return isRtc || pickAPlanSelectedOfferPackageName
                        ? [
                              CheckoutActions.LoadCheckoutSuccess({
                                  payload: {
                                      offer: offerModel,
                                      account: this._comingAccount,
                                      isTokenizedLink: this._isTokenizedLink,
                                  },
                              }),
                          ]
                        : [
                              CheckoutActions.LoadLeadOfferPackageName({ payload: offerModel }),
                              CheckoutActions.CheckRTCFlow({
                                  payload: {
                                      leadOffer: offerModel,
                                      params: {
                                          radioId: this._radioId,
                                          planCode: offerModel.offers[0].planCode,
                                          renewalCode: params.renewalCode,
                                      },
                                  },
                              }),
                              CheckoutActions.LoadCheckoutSuccess({
                                  payload: {
                                      offer: offerModel,
                                      account: this._comingAccount,
                                      isTokenizedLink: this._isTokenizedLink,
                                  },
                              }),
                              ...(state.upsellCode
                                  ? [
                                        CheckoutActions.GetUpsells({
                                            payload: {
                                                planCode: offerModel.offers[0].planCode,
                                                radioId: this._radioId,
                                                streaming: params.isStreaming,
                                                subscriptionId: params.isStreaming ? getSubscriptionIdFromAccount(this._comingAccount) || undefined : undefined,
                                                upsellCode: state.upsellCode,
                                                province: this._appSettings.isCanadaMode ? selectedProvince : undefined,
                                            },
                                        }),
                                    ]
                                  : []),
                          ];
                })
            );
        }),
        catchError((error) => {
            return from([CheckoutActions.LoadCheckoutError({ payload: error }), CheckoutActions.ServiceError({ payload: error })]);
        })
    );

    @Effect()
    loadCheckoutFlepz$ = this._actions$.pipe(
        ofType(CheckoutActions.LoadCheckoutFlepz),
        map((action) => {
            this._isStreaming = action.payload.isStreaming;
            const url = this._window.location.href.toLowerCase();
            if (this._urlHelperService.getIfQueryParamExists('promocode', url) && action.payload.isStreaming && !action.payload.marketingPromoCode) {
                this.handleInvalidPromo(null);
            }
            return {
                programCode: action.payload.programId,
                marketingPromoCode: action.payload.marketingPromoCode,
                isStreaming: action.payload.isStreaming,
            };
        }),
        tap((effectPayload) => {
            if (effectPayload.marketingPromoCode) {
                this._buildDataLayerDeviceInfo(null, effectPayload.marketingPromoCode, true);
            } else {
                this._buildDataLayerDeviceInfo(effectPayload.programCode, null, true);
            }
        }),
        withLatestFrom(this._userSettings.selectedCanadianProvince$),
        map(([dataSettings, canadaProvince]) => CheckoutActions.SetOfferRequest({ ...dataSettings, canadaProvince }))
    );

    @Effect()
    setOfferRequest$ = this._actions$.pipe(
        ofType(CheckoutActions.SetOfferRequest),
        map((offerRequestData) => {
            const marketingPromoCode = offerRequestData.marketingPromoCode || undefined;
            const programCode = offerRequestData.programCode || undefined;
            const streaming = offerRequestData.isStreaming;
            if (this._appSettings.isCanadaMode) {
                const province = this._appSettings.isCanadaMode && offerRequestData.canadaProvince ? offerRequestData.canadaProvince : null;
                return {
                    marketingPromoCode,
                    programCode,
                    streaming,
                    ...(province && { province }),
                };
            } else {
                return {
                    marketingPromoCode,
                    programCode,
                    streaming,
                };
            }
        }),
        withLatestFrom(this._store.pipe(select(getIsStudentFlow))),
        map(([offerRequestData, student]) => CheckoutActions.GetOfferFromService({ ...offerRequestData, student }))
    );

    @Effect()
    getOfferFromService$ = this._actions$.pipe(
        ofType(CheckoutActions.GetOfferFromService),
        concatMap((offerRequest) => {
            const offerRequestComplete = { ...offerRequest };
            delete offerRequestComplete['type'];

            if (offerRequest['marketingPromoCode']) {
                this._store.dispatch(CheckoutActions.setPromoCode({ promoCode: offerRequest.marketingPromoCode }));

                return this._validatePromoCodeWorkflowService.build({ marketingPromoCode: offerRequest['marketingPromoCode'], streaming: offerRequest.streaming }).pipe(
                    concatMap((data) => {
                        this._store.dispatch(CheckoutActions.setIsPromoCodeValid({ isValid: data?.status === 'VALID' }));
                        if (data.status !== 'VALID') {
                            this._store.dispatch(CheckoutActions.setPromoCodeInvalidReason({ reason: data.status }));
                        }
                        return this._store.select(getAllOffers).pipe(
                            take(1),
                            concatMap((offers) =>
                                this._dataOfferSvc.decideOffer(offerRequest.student, offerRequestComplete).pipe(
                                    catchError((error) => {
                                        this._handleDefaultOfferPromoError(error);
                                        return throwError({ getOfferException: true, exception: error });
                                    })
                                )
                            )
                        );
                    })
                );
            }

            return this._store.select(getAllOffers).pipe(
                take(1),
                concatMap((offers) =>
                    this._dataOfferSvc.decideOffer(offerRequest.student, offerRequestComplete).pipe(
                        catchError((error) => {
                            this._handleDefaultOfferProgramCodeError(error);
                            return throwError({ getOfferException: true, exception: error });
                        })
                    )
                )
            );
        }),
        tap((offer) => {
            if (this._isStreaming) {
                this._dataLayerSrv.update(DataLayerDataTypeEnum.OfferData, offer);
            }
            const offerInfo = (offer.offers || [])[0] || null;
            this.handleFallbackCheck(offerInfo);
        }),
        concatMap((offer) => {
            const offerInfo = (offer.offers || [])[0] || null;
            if (offerInfo && offerInfo.student && offerInfo.type === 'RTP_OFFER' && offerInfo.planCode) {
                return this._loadFollowOnOffersForStreamingWorkflowService.build({ planCode: offerInfo.planCode }).pipe(mapTo(offer));
            } else {
                return of(offer);
            }
        }),
        flatMap((offer) => [CheckoutActions.LoadCheckoutFlepzSuccess({ payload: { offer } }), CheckoutActions.LoadLeadOfferPackageName({ payload: offer })]),
        catchError((error) => {
            const programCodeStatus = error.exception?.error?.error?.errorCode;
            const message = programCodeStatus === OfferNotAvailableReasonEnum.EXPIRED ? 'Offer has expired' : 'Invalid offer/Other reason';
            return iif(
                () => error.exception?.error?.httpStatusCode === 400 && !this._isStreaming,
                from([
                    CheckoutActions.setDefaultOfferBehavior({ programCodeStatus }),
                    CheckoutActions.LoadCheckoutFlepzError({ payload: error }),
                    CheckoutActions.ServiceError({ payload: error }),
                    behaviorEventErrorFromBusinessLogic({ message }),
                ]),
                from([CheckoutActions.LoadCheckoutFlepzError({ payload: error }), CheckoutActions.ServiceError({ payload: error })])
            );
        })
    );
    // NOTE Still need to add error catching to this
    @Effect()
    registerAccount$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.RegisterAccount),
        concatMap((data) =>
            this._registerService.registerAccount(data.payload).pipe(
                map((res) => {
                    if (res.status === 'SUCCESS') {
                        return CheckoutActions.RegisterAccountRes({
                            payload: {
                                newRegister: res,
                                accountRegistered: false,
                            },
                        });
                    } else {
                        if (res.passwordValidationResult && !res.passwordValidationResult.isValid) {
                            return CheckoutActions.RegisterAccountError({
                                payload: new RegisterPasswordError(res.passwordValidationResult.validationErrorKey, [res.passwordValidationResult.validationErrorFailedWord]),
                            });
                        }
                        // TODO: Might want to return a general register account error here so the user can retry (instead of system error that sends them to error page)?
                        return CheckoutActions.SystemError({ payload: res });
                    }
                }),
                catchError((error) => {
                    return of(CheckoutActions.SystemError({ payload: error }));
                })
            )
        )
    );

    trackSuccessfulRegistrationEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(CheckoutActions.RegisterAccountRes),
            map((_) => behaviorEventReactionForSuccessfulRegistration())
        )
    );

    trackFailedRegistrationEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(CheckoutActions.RegisterAccountError, CheckoutActions.SystemError),
            map((_) => behaviorEventReactionForFailedRegistration())
        )
    );

    @Effect({ dispatch: false })
    onSystemError$ = this._actions$.pipe(
        ofType(CheckoutActions.SystemError),
        tap((action) => {
            this._dataLayerSrv.buildErrorInfo(action.payload);
            this._router.navigate(['/error']);
        })
    );

    @Effect({ dispatch: false })
    onServiceError$ = this._actions$.pipe(
        ofType(CheckoutActions.ServiceError),
        withLatestFrom(this._store.select(getCheckoutState)),
        map(([action, state]) => {
            const error = state.error || action.payload;
            const token: string = this._urlHelperService.getCaseInsensitiveParam(this.route.snapshot.queryParamMap, 'tkn');
            const programcode: string = state.programCode;
            const radioId: string = this._urlHelperService.getCaseInsensitiveParam(this.route.snapshot.queryParamMap, 'RadioID');
            const accountNumber: string = this._urlHelperService.getCaseInsensitiveParam(this.route.snapshot.queryParamMap, 'act');
            const lastName: string = this._urlHelperService.getCaseInsensitiveParam(this.route.snapshot.queryParamMap, 'lname');
            const oacUrl: string = `${this._env.settings.oacUrl}`;

            if (error instanceof Error) {
                if (error.message === 'closed radio') {
                    const identityRequestData: IdentityRequestModel = this._identityRequestStoreService.getIdentityRequestData();
                    const requestType = identityRequestData.requestType;
                    if (requestType === 'flepz') {
                        if (this._document) {
                            const form = this._document.createElement('form');
                            form.method = 'post';
                            form.action = oacUrl + 'oacrouterselector_executeSelect.action?searchMode=flepz_search&pageName=selector_page&OLPT=OLPTPCOFFER1A';
                            const flepzInfo: IdentityFlepzRequestModel = identityRequestData.flepzInfo;
                            this._addFormField(form, 'firstname', flepzInfo.firstName);
                            this._addFormField(form, 'lastname', flepzInfo.lastName);
                            this._addFormField(form, 'email', flepzInfo.email);
                            this._addFormField(form, 'phonenumber', flepzInfo.phoneNumber);
                            this._addFormField(form, 'zipcode', flepzInfo.zipCode);
                            this._addFormField(form, 'selectedRadio', identityRequestData.selectedRadio);
                            this._addFormField(form, 'radio-matches', identityRequestData.selectedRadio);
                            this._document.body.appendChild(form);
                            form.submit();
                        }
                    } else if (requestType === 'radioId' || requestType === 'vin') {
                        if (this._document) {
                            const form = this._document.createElement('form');
                            form.method = 'post';
                            form.action = oacUrl + 'newradioinformation_execute.action?searchMode=rid_search&failedAttempts=0&OLPT=OLPTPCOFFER1A';
                            if (requestType === 'radioId') {
                                this._addFormField(form, 'radioid', identityRequestData.radioId);
                            } else {
                                this._addFormField(form, 'radioid', identityRequestData.vin);
                            }
                            this._document.body.appendChild(form);
                            form.submit();
                        }
                    } else if (requestType === 'licensePlate') {
                        if (this._document) {
                            const form = this._document.createElement('form');
                            form.method = 'post';
                            form.action = oacUrl + 'licenseplatelookup_useVinFromLicensePlateLookup.action';
                            this._addFormField(form, 'plateNumber', identityRequestData.licencePlateInfo.licensePlate);
                            this._addFormField(form, 'state', identityRequestData.licencePlateInfo.state);
                            this._addFormField(form, 'agreeCheck', 'true');
                            this._addFormField(form, 'sourceFunction', 'Router VIN Lookup');
                            this._addFormField(form, 'olpt', 'OLPTPCOFFER1A');
                            this._document.body.appendChild(form);
                            form.submit();
                        }
                    } else {
                        const url = oacUrl + 'comeback?';
                        let params: string;
                        if (token) {
                            params = `tkn=${token}&programCode=${programcode}`;
                        } else if (radioId && accountNumber) {
                            params = `RadioID=${radioId}&act=${accountNumber}&programcode=${programcode}`;
                        } else if (radioId && lastName) {
                            params = `RadioID=${radioId}&lname=${lastName}&programcode=${programcode}`;
                        } else {
                            params = `RadioID=${state.closedRadioInfo.closedRadio.last4DigitsOfRadioId}&act=${state.closedRadioInfo.accountNumber}&programcode=${programcode}`;
                        }
                        this._window.location.href = url + params;
                    }
                } else {
                    if (
                        error.message === EventErrorEnum.InvalidToken ||
                        error.message === EventErrorEnum.InvalidRadioID ||
                        error.message === EventErrorEnum.InvalidAccountNumber ||
                        error.message === EventErrorEnum.InvalidLastName
                    ) {
                        if (error.message === EventErrorEnum.InvalidToken) {
                            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Token invalid' }));
                        } else if (error.message === EventErrorEnum.InvalidRadioID) {
                            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'RID invalid' }));
                        } else if (error.message === EventErrorEnum.InvalidAccountNumber) {
                            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Account Number invalid' }));
                        } else if (error.message === EventErrorEnum.InvalidLastName) {
                            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Last Name invalid' }));
                        }
                        // Note: replaceUrl option is needed here because there are several factors in the app architecture
                        //       that make it so a "back" navigation will not result in a reload of the state data. So we
                        //       replace the url here so that the user will not have the previous url in their browser state history
                        //       to avoid the issue.
                        const getCaseInsensitiveParam = (param: string) => this._urlHelperService.getCaseInsensitiveParam(this.route.snapshot.queryParamMap, param);
                        const calcProgramCode = this._programCode || getCaseInsensitiveParam('programcode');
                        const tbView = this._tbView || getCaseInsensitiveParam('tbView');
                        const upcode = getCaseInsensitiveParam('upcode');
                        const promocode = getCaseInsensitiveParam('promocode');
                        const langpref = getCaseInsensitiveParam('langpref');
                        const renewalCode = getCaseInsensitiveParam('renewalcode');
                        this._router.navigate(['/subscribe/checkout/flepz'], {
                            queryParams: {
                                programcode: calcProgramCode,
                                tbView,
                                upcode,
                                promocode,
                                langpref,
                                renewalCode,
                            },
                            replaceUrl: true,
                        });
                    } else {
                        if (this._appSettings.isCanadaMode) {
                            const queryParams: Params = {
                                programcode: programcode,
                            };
                            this._router.navigate(['/subscribe/checkout/flepz'], {
                                queryParams,
                            });
                        } else {
                            this._window.location.href = oacUrl + 'newradioinformation_initialView.action';
                        }
                    }
                }
            } else {
                /*if (error.error.httpStatus === 'INTERNAL_SERVER_ERROR') {
                    this._router.navigate(['/error']);
                }
                if (error.error.httpStatus === 'UNAUTHORIZED') {
                    this._router.navigate(['/error']);
                } else {
                    this._window.location.href = oacUrl + 'newradioinformation_initialView.action';
                }*/
                throw error; // throw for the global error handler to handle
            }
        })
    );

    @Effect()
    studentVerificationValidationSuccess$ = this._actions$.pipe(
        ofType(CheckoutActions.IngressStudentVerificationIdValidateSuccess),
        concatMap(({ account }) => {
            const firstName = account.firstName;
            const lastName = account.lastName;
            const email = account.email;
            return [setFirstName({ firstName }), setLastName({ lastName }), setEmail({ email })];
        })
    );

    @Effect()
    studentVerificationValidationFailure$ = this._actions$.pipe(
        ofType(CheckoutActions.IngressStudentVerificationIdValidateFallback),
        map(() => CheckoutActions.SetOfferNotAvailable({ payload: OfferNotAvailableReasonEnum.OTHERS }))
    );

    private _trackOfferNotAvailableConfirmationPage(): void {
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.OfferNotAvailableConfirmation, {
            flowName: FlowNameEnum.Checkout,
            componentName: ComponentNameEnum.OfferNotAvailableConfirmation,
        });
    }

    private _buildDataLayerPlanInfo(): void {
        const subscription: SubscriptionModel = this._comingAccount.subscriptions[0];
        if (this._comingAccount && subscription.plans[0]) {
            const serviceStartDate: any = new Date(subscription.plans[0].startDate);
            const serviceEndDate: any = new Date(subscription.plans[0].endDate);
            const todayDate: any = new Date();

            const numDaysRadioActive: number = Math.floor((todayDate - serviceStartDate) / (1000 * 60 * 60 * 24));
            const numDaysRadioInactive: number = Math.floor((todayDate - serviceEndDate) / (1000 * 60 * 60 * 24));

            this._dataLayerSrv.update(DataLayerDataTypeEnum.PlanInfo, {
                serviceStartDate: serviceStartDate,
                serviceEndDate: serviceEndDate,
                ...(numDaysRadioActive >= 0 && { numDaysRadioActive }),
                ...(numDaysRadioInactive >= 0 && { numDaysRadioInactive }),
            });
        }
    }

    private _buildDataLayerDeviceInfo(programCode?: string, marketingPromoCode?: string, isFlepzLink = false): void {
        const deviceInfoObj: any = this._dataLayerSrv.getData(DataLayerDataTypeEnum.DeviceInfo) || {};

        if (this._comingAccount) {
            const hasSubscriptions = this._comingAccount.subscriptions && this._comingAccount.subscriptions.length > 0;
            const offerPackage: PackageModel = this._comingOffer.offers[0];
            const closedDevices: Array<any> = this._comingAccount.closedDevices;
            if (hasSubscriptions) {
                const subscription: SubscriptionModel = this._comingAccount.subscriptions[0];
                if (subscription.radioService) {
                    deviceInfoObj.esn = subscription.radioService.last4DigitsOfRadioId;
                    deviceInfoObj.status = RadioStatusEnum.Active;
                    deviceInfoObj.serviceId = subscription.radioService.id;
                }
            } else if (closedDevices && closedDevices.length > 0) {
                deviceInfoObj.esn = closedDevices[0].last4DigitsOfRadioId;
                deviceInfoObj.status = RadioStatusEnum.Closed;
                deviceInfoObj.serviceId = null;
            }
            deviceInfoObj.promoCode = offerPackage.promoCode;
            deviceInfoObj.programCode = programCode;
            deviceInfoObj.marketingPromoCode = marketingPromoCode;
        } else if (isFlepzLink) {
            if (programCode) {
                deviceInfoObj.programCode = programCode;
            } else if (marketingPromoCode) {
                deviceInfoObj.marketingPromoCode = marketingPromoCode;
            }
        }

        this._dataLayerSrv.update(DataLayerDataTypeEnum.DeviceInfo, deviceInfoObj);
    }

    // TODO: Move this logic into domain offers state-offers effect that can run after setOffers
    private _buildDataLayerPageInfo4OfferRedirect() {
        const isFallback: boolean = this._comingOffer.offers[0].fallback;

        if (isFallback) {
            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Program Code invalid' }));
        }
    }

    private _dispatchOffersDataEvent(): void {
        const digitalData: any = this._window['digitalData'];
        if (digitalData.offer) {
            const offersDataReadyEvent = new CustomEvent(CustomEventNameEnum.OffersDataAvailable, {
                detail: {
                    message: 'Offers data populated at digitalData.offer',
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true,
            });
            this._window.dispatchEvent(offersDataReadyEvent);
        }
    }

    private _addFormField(form: any, fieldName: string, fieldValue: string): void {
        const hiddenField = this._document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = fieldName;
        hiddenField.value = fieldValue;
        form.appendChild(hiddenField);
    }

    private _hasFieldError(httpError: HttpErrorResponse, fieldName: string): boolean {
        if (httpError && httpError.error && httpError.error.error && httpError.error.error.fieldErrors) {
            const fieldErrors = httpError.error.error.fieldErrors;
            const fieldError = fieldErrors.find((error) => error.fieldName === fieldName);
            if (fieldError) {
                return true;
            }
        }

        return false;
    }

    private handleFallbackCheck(offer: PackageModel): void {
        if (
            offer &&
            offer.fallback &&
            offer.fallbackReason !== OfferNotAvailableReasonEnum.NONE &&
            Object.values(OfferNotAvailableReasonEnum).includes(offer.fallbackReason) &&
            this._offerNotAvailableReason !== OfferNotAvailableReasonEnum.REDEEMED
        ) {
            this._offerNotAvailableReason = offer.fallbackReason;
            this._store.dispatch(CheckoutActions.SetOfferNotAvailable({ payload: this._offerNotAvailableReason }));
            this._trackOfferNotAvailableConfirmationPage();
        }
    }

    private handleInvalidPromo(error): void {
        const fieldError = error?.error?.fieldErrors[0]?.errorCode as OfferNotAvailableReasonEnum;
        this._offerNotAvailableReason = fieldError ? fieldError : OfferNotAvailableReasonEnum.OTHERS;
        this._store.dispatch(CheckoutActions.SetOfferNotAvailable({ payload: this._offerNotAvailableReason }));
        this._trackOfferNotAvailableConfirmationPage();
    }

    private handleRedeemedPromo(): void {
        this._offerNotAvailableReason = OfferNotAvailableReasonEnum.REDEEMED;
        this._store.dispatch(CheckoutActions.SetOfferNotAvailable({ payload: OfferNotAvailableReasonEnum.REDEEMED }));
        this._trackOfferNotAvailableConfirmationPage();
    }

    private _handleDefaultOfferPromoError(error) {
        const promoCodeStatus = error?.error?.error?.errorCode as OfferNotAvailableReasonEnum;
        if (
            promoCodeStatus === OfferNotAvailableReasonEnum.OTHERS ||
            promoCodeStatus === OfferNotAvailableReasonEnum.REDEEMED ||
            promoCodeStatus === OfferNotAvailableReasonEnum.EXPIRED ||
            promoCodeStatus === OfferNotAvailableReasonEnum.NOT_FOUND
        ) {
            // This line is needed to trigger default offer flow
            this._store.dispatch(CheckoutActions.setDefaultOfferBehavior({ programCodeStatus: promoCodeStatus }));
            // set promo as invalid
            this._store.dispatch(CheckoutActions.LoadCheckoutFlepzError({ payload: error }));
            this._store.dispatch(CheckoutActions.setIsPromoCodeValid({ isValid: false }));
        }
    }

    private _handleDefaultOfferProgramCodeError(error) {
        const programCodeStatus = error?.error?.error?.errorCode as OfferNotAvailableReasonEnum;
        if (programCodeStatus === OfferNotAvailableReasonEnum.OTHERS || programCodeStatus === OfferNotAvailableReasonEnum.EXPIRED) {
            this._store.dispatch(CheckoutActions.setDefaultOfferBehavior({ programCodeStatus: programCodeStatus }));
            this._store.dispatch(CheckoutActions.LoadCheckoutFlepzError({ payload: error }));
        }
    }

    createNewAccount(radioId: string): AccountModel {
        return {
            subscriptions: [
                {
                    radioService: {
                        last4DigitsOfRadioId: radioId,
                        id: '',
                        vehicleInfo: {},
                    },
                    id: '',
                    plans: [],
                },
            ],
            accountProfile: {
                accountRegistered: false,
            },
            closedDevices: [],
            billingSummary: {
                creditCard: null,
            },
            isNewAccount: true,
        } as AccountModel;
    }
}
