import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/validate/password';
interface Request {
    value: string;
}
interface Response {
    valid: boolean;
    validationErrorKey: '' | 'validation.password.new.dictionaryWords' | 'validation.password.new.charsAllowed';
    validationErrorFailedWord: string;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class PasswordValidationService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    validatePassword(password) {
        const options = { withCredentials: true };
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, { value: password }, options);
    }
}
