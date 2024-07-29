import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/utility/log-message';

interface RequestModel {
    message?: string;
    url: string;
    stacktrace?: string;
    logLevel?: 'INFO' | 'WARN' | 'ERROR';
}

type ServiceRequestModel = {
    url: string;
    stacktrace?: string;
    message: string;
    logLevel?: 'INFO' | 'WARN' | 'ERROR';
};

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataLogMessageService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }
    logMessage(payload: RequestModel): Observable<boolean> {
        return this._post<ServiceRequestModel, null, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            {
                url: payload.url || '/',
                stacktrace: payload.stacktrace,
                message: payload.message || '',
                logLevel: payload.logLevel,
            },
            {
                withCredentials: true,
                headers: {
                    'X-Skip-Http-Interceptor': 'true', // temp solution to stop potential http error from this service being caught by the interceptor code in apps/de-care/src/app/core/services/global-http-interceptor.service.ts
                },
            }
        );
    }
}
