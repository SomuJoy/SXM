import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ParamMap, Router, UrlTree } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { omitParamsCaseInsensitive, QueryParamMap } from '@de-care/browser-common';
import {
    IngressNonStudent,
    IngressStudentVerificationIdValidateError,
    IngressStudentVerificationIdValidateFallback,
    IngressStudentVerificationNameAndEmail,
    IngressStudnetVerificationWithAccountModel,
} from '@de-care/checkout-state';
import {
    ComponentNameEnum,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    ServerResponseStudentVerificationErrorFailedValidation,
    ServerResponseStudentVerificationErrorInvalidToken,
    StudentInfo,
} from '@de-care/data-services';
import { VerifyStudentWorkflowService } from '@de-care/domains/identity/state-verify-student';
import { Store } from '@ngrx/store';
import { of, iif } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import { UserSettingsService, SettingsService } from '@de-care/settings';
import { IPProvinceQuebecWorkflow } from '@de-care/data-workflows';
import {
    LoadAccountFromTokenWorkflowService,
    isActiveSubscription,
    getSubscriptionIdFromAccount,
    AccountFromTokenModel,
    isRegisteredAccount,
} from '@de-care/domains/account/state-account';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';

const TOKEN_URL_PARAM = 'tkn';
const VERIFICATION_ID_URL_PARAM = 'verificationid';
@Injectable({
    providedIn: 'root',
})
export class CanActivateStudentVerificationValidation implements CanActivate {
    constructor(
        private _router: Router,
        private _urlHelperService: UrlHelperService,
        private _verifyStudentWorkflowService: VerifyStudentWorkflowService,
        private _store: Store<{}>,
        private _ipProvinceQuebecWorkflow: IPProvinceQuebecWorkflow,
        private _dataLayerService: DataLayerService,
        private _eventTrackService: SharedEventTrackService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private _loadAccountFromTokenWorkflowService: LoadAccountFromTokenWorkflowService,
        private _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}
    private _triggerStudentActivationStatusAction(studentVerificationStatus: string) {
        const dataLayerAccountInfo = this._dataLayerService.getData(DataLayerDataTypeEnum.AccountData) || {};
        this._dataLayerService.update(DataLayerDataTypeEnum.AccountData, {
            ...dataLayerAccountInfo,
            studentVerification: studentVerificationStatus,
        });
        this._eventTrackService.track(DataLayerActionEnum.StudentVerificationStatus, { componentName: ComponentNameEnum.PaymentInfo });
    }
    private _redirectToStreamingWithoutVerificationId(paramMap: ParamMap) {
        const paramsWithoutVerificationId = omitParamsCaseInsensitive(paramMap, VERIFICATION_ID_URL_PARAM);
        const urlTree = this._router.createUrlTree(['/subscribe', 'checkout', 'streaming'], { queryParams: paramsWithoutVerificationId });
        return of(urlTree);
    }
    private _verifyStudent(verificationId: string, paramMap: ParamMap, accountResponse: AccountFromTokenModel | null) {
        return this._verifyStudentWorkflowService.build({ verificationId }).pipe(
            map<StudentInfo, UrlTree | boolean>((resp) => {
                if (!!resp) {
                    this._triggerStudentActivationStatusAction('success');
                    if (
                        accountResponse &&
                        accountResponse.nonPIIAccount !== null &&
                        !isActiveSubscription(accountResponse.nonPIIAccount, getSubscriptionIdFromAccount(accountResponse.nonPIIAccount)) &&
                        isRegisteredAccount(accountResponse.nonPIIAccount) &&
                        accountResponse.isUserNameInTokenSameAsAccount
                    ) {
                        this._store.dispatch(IngressStudnetVerificationWithAccountModel({ account: accountResponse.nonPIIAccount }));
                    } else {
                        this._store.dispatch(
                            IngressStudentVerificationNameAndEmail({
                                firstName: resp.firstName,
                                lastName: resp.lastName,
                                email: resp.email,
                            })
                        );
                    }
                    return true;
                }
                throw new Error('Invalid response'); // this is handled in catchError below
            }),
            catchError((err) => {
                this._store.dispatch(IngressStudentVerificationIdValidateError());
                if (err && err.error && err.error.error) {
                    if (err.error.error.errorCode === ServerResponseStudentVerificationErrorInvalidToken) {
                        // redirect to student verification landing if the verificationId was invalid
                        this._triggerStudentActivationStatusAction('no-verification');
                        return of(this._router.parseUrl('/subscribe/checkout/studentverification'));
                    }
                    if (err.error.error.fieldErrors[0].errorCode === ServerResponseStudentVerificationErrorFailedValidation) {
                        // treat the user as non-student
                        this._triggerStudentActivationStatusAction('error');
                        this._store.dispatch(IngressStudentVerificationIdValidateFallback());
                        return this._redirectToStreamingWithoutVerificationId(paramMap);
                    }
                }
                // redirect to generic error if microservice call failed for another reason
                return of(this._router.parseUrl('/error'));
            })
        );
    }

    private _tokenLookup(token: string) {
        return this._loadAccountFromTokenWorkflowService.build({ token, student: true, isStreaming: true, tokenType: 'SALES_STREAMING' }).pipe(catchError(() => of(null)));
    }

    private _lookupIPForQuebec(verificationId: string, queryParamMap: ParamMap, account: AccountFromTokenModel | null) {
        // Determine if user has a Quebec IP address and redirect them
        return this._ipProvinceQuebecWorkflow.build().pipe(
            mergeMap((isQuebec) => {
                if (isQuebec) {
                    // If true, act as non-student and redirect them back without verificationId
                    this._store.dispatch(IngressNonStudent());
                    return this._redirectToStreamingWithoutVerificationId(queryParamMap);
                }
                // Otherwise, verify their token
                return this._verifyStudent(verificationId, queryParamMap, account);
            }),
            // If the call fails, use the default
            catchError(() => this._verifyStudent(verificationId, queryParamMap, account))
        );
    }

    private _initiateStudentVerification(route: ActivatedRouteSnapshot, account: AccountFromTokenModel | null) {
        const verificationId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, VERIFICATION_ID_URL_PARAM);
        // See if we are not in the student flow (no verificationId)
        // If so, just proceed
        if (!verificationId) {
            this._store.dispatch(IngressNonStudent());
            return of(true);
        }

        // Province selection is disabled for student streaming
        this._userSettingsService.setProvinceSelectionDisabled(true);

        if (this._settingsService.isCanadaMode) {
            return this._lookupIPForQuebec(verificationId, route.queryParamMap, account); // IP lookup for Canada only
        }

        return this._verifyStudent(verificationId, route.queryParamMap, account); // US proceed directly
    }

    canActivate(route: ActivatedRouteSnapshot) {
        // retrieve the verificationId from query params
        const tkn = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, TOKEN_URL_PARAM);

        return this._updateUsecaseWorkflowService.build({ useCase: 'RTP_STREAMING' }).pipe(
            switchMap((resp) => {
                if (resp) {
                    return iif(() => !!tkn, this._tokenLookup(tkn), of(null)).pipe(
                        switchMap((account) => {
                            return this._initiateStudentVerification(route, account);
                        })
                    );
                }
            })
        );
    }
}
