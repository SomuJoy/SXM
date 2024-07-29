import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NormalizeLangPrefHelperService, UrlHelperService } from '@de-care/app-common';
import { AccountModel, DataAccountService, DataOfferService, getRadioIdOnAccount, isClosedRadio, PackageModel } from '@de-care/data-services';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, mapTo, mergeMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { OemNavigationService } from '@de-care/de-oem/util-route';
import { Account } from './data-models/account';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { AccountForOemWorkflow } from '@de-care/data-workflows';
import { ActiveSubscriptionError, CAAccountError } from './oem-flow-error';

export interface OemFlowRouteData {
    programCode: string;
    radioIdLastFour: string;
    account: Account;
    selectedOffer: PackageModel;
}

@Injectable()
export class OemFlowResolver implements Resolve<OemFlowRouteData> {
    private _langPref: string;
    private _accessToken: string;
    private _refreshToken: string;

    constructor(
        private readonly _dataAccountService: DataAccountService,
        private readonly _dataOfferService: DataOfferService,
        private readonly _urlHelperService: UrlHelperService,
        private readonly _oemNavigationService: OemNavigationService,
        private readonly _normalizeLangPrefHelperService: NormalizeLangPrefHelperService,
        private readonly _settings: SettingsService,
        private readonly _translate: TranslateService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _accountForOemWorkflow: AccountForOemWorkflow,
        private readonly _store: Store,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<OemFlowRouteData> {
        const programCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');

        this._langPref = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'langPref');
        const country = this._settings.settings.country.toUpperCase();

        this._accessToken = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'SXM_D_A');
        this._refreshToken = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'SXM_D_R');

        const normalizedLangPref = !!this._langPref
            ? this._normalizeLangPrefHelperService.normalize(this._langPref, country)
            : this._normalizeLangPrefHelperService.normalize('en', country);

        this._translate.use(normalizedLangPref);

        return this._accountForOemWorkflow.build({ accessToken: this._accessToken, refreshToken: this._refreshToken }).pipe(
            map((response) => {
                const account = response.nonPIIAccount;
                if (response.region === 'CA' && !account) {
                    this._accessToken = response.accessToken;
                    this._refreshToken = response.refreshToken;
                    throw new CAAccountError('Canada account');
                }
                if (this._settings.isCanadaMode) {
                    this._userSettingsService.setSelectedCanadianProvince(account && account.serviceAddress ? account.serviceAddress.state : undefined);
                }

                if (this._accountHasAnActiveSubscription(account)) {
                    throw new ActiveSubscriptionError('ESN already have active subscription');
                } else {
                    return { account, last4DigitsOfRadioId: getRadioIdOnAccount(account) };
                }
            }),
            mergeMap(({ account, last4DigitsOfRadioId }) =>
                this._getOffer(programCode, last4DigitsOfRadioId).pipe(
                    concatMap((selectedOffer) => {
                        const results = { selectedOffer };
                        return this._loadOfferInfo(selectedOffer.planCode).pipe(mapTo(results));
                    }),
                    map(({ selectedOffer }) => ({
                        programCode,
                        radioIdLastFour: last4DigitsOfRadioId,
                        selectedOffer,
                        account: { hasEmailAddressOnFile: account.hasEmailAddressOnFile },
                        isClosedRadio: isClosedRadio(account),
                    }))
                )
            ),
            catchError((error) => {
                if (error instanceof ActiveSubscriptionError) {
                    this._oemNavigationService.goToManageAccount();
                } else if (error instanceof CAAccountError) {
                    this._oemNavigationService.redirectToCAOemApp(this._langPref, this._accessToken, this._refreshToken, programCode);
                } else {
                    this._oemNavigationService.goToErrorPage(this._langPref);
                }
                return EMPTY;
            })
        );
    }

    private _getOffer(programCode: string, radioId: string): Observable<PackageModel> {
        return this._dataOfferService.customer({ programCode, radioId }).pipe(map((response) => response.offers[0]));
    }

    private _loadOfferInfo(planCode: string) {
        return this._loadOffersInfoWorkflowService.build({
            planCodes: [{ leadOfferPlanCode: planCode }],
            province: undefined,
            radioId: undefined,
        });
    }

    private _accountHasAnActiveSubscription(account: AccountModel) {
        return this._dataAccountService.accountHasActiveSubscription(account.subscriptions[0]);
    }
}
