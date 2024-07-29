import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/account/prospect/streaming-password-reset-token';

// TODO: update the Request/Response models and the error codes based on final endpoint implementation
interface Request {
    resetToken: string;
}
interface Response {
    status: string;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataStreamingPasswordResetTokenService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    validateToken(payload: Request): Observable<Response> {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
