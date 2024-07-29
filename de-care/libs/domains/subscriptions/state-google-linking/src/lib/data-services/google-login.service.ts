import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';

export const endpointURL = '/authenticate/linking/google';
interface Request {
    subscriptionId: any;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class GoogleLoginService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    authenticate(params: any) {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${endpointURL}`, params, { withCredentials: true });
    }
}
