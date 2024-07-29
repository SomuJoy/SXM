//================================================================================
// Angular
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// ===============================================================================
// Imported Features (Data Services)
import {
    AccountModel,
    AccountDataRequest,
    AccountVerify,
    TokenPayload,
    AccountFromTokenModel,
    AccountProfile,
    AccountBillingSummary,
    NonPiiResponse,
    OemResponse,
    OemRequest,
} from '../models/account.model';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { SubscriptionModel } from '../models/subscription.model';
import { PlanTypeEnum } from '../enums/plan-type.enum';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { VehicleModel } from '../models/vehicle.model';
import { UserModel } from '../models/user.model';
import { CustomerSessionInfoModel } from '../models/customer-session.model';

@Injectable({ providedIn: 'root' })
export class DataAccountService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    getFromToken(tokenPayload: TokenPayload, allowErrorHandler: boolean = true): Observable<AccountFromTokenModel> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http.post<MicroservicesResponse<AccountFromTokenModel>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_TOKEN}`, tokenPayload, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    nonPii(accountData: AccountDataRequest): Observable<NonPiiResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<NonPiiResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_NON_PII}`, accountData, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    oem(request: OemRequest): Observable<OemResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_OEM}`, request, options).pipe(map((response) => response.data));
    }

    /**
     * @deprecated Use VerifyAccountByLpzWorkflowService workflow from @de-care/domains/account/state-account
     */
    verify(accountData: AccountVerify): Observable<boolean> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<boolean>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_VERIFY}`, accountData, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    activateTrial(token: string): Observable<AccountModel> {
        const options = { withCredentials: false };
        return this._http.get<MicroservicesResponse<AccountModel>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_ACTIVATE_TRIAL}/${token}`, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    accountHasActiveSubscription(subscription: SubscriptionModel): boolean {
        const PACKAGE_LAST_PREVIEW = 'SIR_AUD_LAST';
        return (
            subscription &&
            (!!subscription.plans.find(
                (plan) => plan && plan.type && plan.type !== PlanTypeEnum.Trial && plan.packageName && !plan.packageName.includes(PACKAGE_LAST_PREVIEW)
            ) ||
                (subscription.followonPlans && subscription.followonPlans.length > 0))
        );
    }

    sanitizeVehicleInfo(vehicleInfo: VehicleModel) {
        if (vehicleInfo) {
            vehicleInfo.make = vehicleInfo.make || '';
            vehicleInfo.model = vehicleInfo.model || '';
            vehicleInfo.year = vehicleInfo.year || '';
        }
    }

    generateEmptyAccount(): AccountModel {
        return <AccountModel>{
            customerInfo: <UserModel>{ firstName: '', email: '' },
            accountProfile: <AccountProfile>{ accountRegistered: false, newRegister: false },
            subscriptions: [],
            billingSummary: <AccountBillingSummary>{
                creditCard: null,
            },
            closedDevices: [],
            isNewAccount: true,
        };
    }

    /**
     * @deprecated use workflow from @de-care/domains/account/state-session-data
     */
    getCustomerDataFromSession(): Observable<CustomerSessionInfoModel> {
        const options = { withCredentials: true };
        return this._http.get<MicroservicesResponse<CustomerSessionInfoModel | null>>(`${this.url}${ENDPOINTS_CONSTANTS.CUSTOMER_INFO}`, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
