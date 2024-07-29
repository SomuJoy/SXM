import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { Observable, of } from 'rxjs';
import { SecurityQuestionsModel } from '../models/security-questions.model';
import { TranslateService } from '@ngx-translate/core';
import { NuCaptchaRequestModel, NuCaptchaResponseModel } from '../models/utility.model';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { Ip2LocationModel } from '../models/ip2-location.model';

@Injectable({
    providedIn: 'root',
})
export class DataUtilityService {
    //================================================
    //===               Variables                ===
    //================================================
    private _logPrefix: string = '[Utilities]:';
    private serviceUrl: string;

    //================================================
    //===               Constructor                ===
    //================================================
    constructor(private _http: HttpClient, private _env: SettingsService, private _translateSvc: TranslateService) {
        if (this._env.settings && this._env.settings.apiUrl) {
            this.serviceUrl = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
        }
        // setting custom translations
        this._translateSvc.setTranslation('en-CA', require('../i18n/data-utility-service.en-CA.json'), true);
        this._translateSvc.setTranslation('en-US', require('../i18n/data-utility-service.en-US.json'), true);
        this._translateSvc.setTranslation('fr-CA', require('../i18n/data-utility-service.fr-CA.json'), true);
    }

    //================================================
    //===             Public Functions             ===
    //================================================
    securityQuestions(): Observable<SecurityQuestionsModel[]> {
        return this._http.get<MicroservicesResponse<SecurityQuestionsModel[]>>(`${this.url}${ENDPOINTS_CONSTANTS.UTILITY_SECURITY_QUESTIONS}`, { withCredentials: true }).pipe(
            map((response) => {
                // replace the response data from the api with an data object that uses
                // the ngx-translate TranslateService to populate the `question` value based on the `id` value
                const translatedSecurityQuestions = response.data.map((sq) => {
                    return {
                        id: sq.id,
                        question: this._translateSvc.instant(`dataServices.dataUtilityService.securityQuestions.${sq.id}`),
                    };
                });
                return translatedSecurityQuestions;
            })
        );
    }

    pingApi(): Observable<any> {
        return this._http.get(`${this.url}${ENDPOINTS_CONSTANTS.UTILITY_ENV_INFO}`, { withCredentials: true });
    }

    /**
     * @deprecated Use libs/de-care-use-cases/shared/ui-router-common/src/lib/routing/LoadIpLocationAndSetProvinceCanActivateService
     * or libs/domains/utility/state-ip-location/src/lib/workflows/GetProvinceFromCurrentIpWorkflowService
     */
    getIp2LocationInfo(ip2LocationModel: Ip2LocationModel): Observable<string> {
        const params = { ...ip2LocationModel };
        const options = { withCredentials: true };
        if (this._env.settings.country !== 'ca') {
            return of(null);
        }
        return this._http.post<MicroservicesResponse<{ region: string }>>(`${this.url}${ENDPOINTS_CONSTANTS.UTILITY_IP2_LOCATION}`, params, options).pipe(
            map((response) => {
                return response.data && response.data?.region?.toUpperCase();
            })
        );
    }

    logMessage(stack: string, url: string): Observable<any> {
        return this._http.post<MicroservicesResponse<any>>(`${this.url}${ENDPOINTS_CONSTANTS.UTILITY_LOGGING}`, { stack, url }, { withCredentials: true }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    get url(): string {
        if (!this.serviceUrl) {
            this.serviceUrl = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
        }
        return this.serviceUrl;
    }

    getNuCaptcha(params?: NuCaptchaRequestModel): Observable<NuCaptchaResponseModel> {
        return this._http.post<MicroservicesResponse<NuCaptchaResponseModel>>(`${this.url}${ENDPOINTS_CONSTANTS.UTILITY_CAPTCHA_NEW}`, params).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
