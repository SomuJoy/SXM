import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroservicesResponse, NuCaptchaNewRequestModel, NuCaptchaNewResponseModel, NuCaptchaValidateRequestModel, NuCaptchaValidateResponseModel } from './nu-captcha.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';

const ENDPOINT_URL = '/utility/captcha';

@Injectable({
    providedIn: 'root',
})
export class DataNucaptchaService {
    private readonly url: string;

    constructor(private readonly _http: HttpClient, @Inject(MICROSERVICE_API_BASE_URL) apiUrl: string) {
        this.url = `${apiUrl}${ENDPOINT_URL}`;
    }

    new(params?: NuCaptchaNewRequestModel): Observable<NuCaptchaNewResponseModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<NuCaptchaNewResponseModel>>(`${this.url}/new`, params, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    validate(params?: NuCaptchaValidateRequestModel): Observable<NuCaptchaValidateResponseModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<NuCaptchaValidateResponseModel>>(`${this.url}/validate`, params, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
