import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { IEmailValidationResponse } from '..//interfaces/validator.interface';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

export interface IEmailPayload {
    email: string;
}

export interface UserNameValidation {
    userName: string;
    reuseUserName?: boolean;
}

export interface CustomerValidation {
    verifyThirdParty?: boolean;
    email?: {
        email: string;
        streaming?: boolean;
    };
    username?: {
        userName: string;
        accountNumber?: string;
        reuseUserName?: boolean;
    };
    billingAddress?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        zip: string;
    };
    serviceAddress?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        zip: string;
    };
    creditCard?: {
        accountNumber?: number;
        creditCardNumber: number;
    };
}

export interface CustomerValidateResponse {
    valid: boolean;
    emailValidation: {
        valid: boolean;
    };
    usernameValidation: {
        valid: boolean;
    };
    billingAddressValidation: AddressValidation;
    serviceAddressValidation?: AddressValidation;
    ccValidation?: {
        valid: boolean;
    };
}

export interface AddressValidation {
    confidenceLevel: 'None' | 'Verified' | 'PremisesPartial' | 'InteractionRequired' | 'StreetPartial' | 'Multiple' | 'BLANK';
    correctedAddress?: CorrectedAddress[];
    validationStatus: 'VALID' | 'NOT_VALID';
}

export interface CorrectedAddress {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip: string;
}

export interface PromoCodeValidateResponse {
    status: string;
    promoCode: string;
}

export interface PasswordValidateResponse {
    valid: boolean;
    validationErrorKey: '' | 'validation.password.new.dictionaryWords' | 'validation.password.new.charsAllowed';
    validationErrorFailedWord: string;
}

@Injectable({ providedIn: 'root' })
export class DataValidationService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    validateEmail(payload: IEmailPayload, allowErrorHandler: boolean = true): Observable<IEmailValidationResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http.post<MicroservicesResponse<IEmailValidationResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.VALIDATE_EMAIL}`, payload, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    validateCustomerInfo(payload: CustomerValidation, allowErrorHandler: boolean = true): Observable<CustomerValidateResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        if (payload.username) {
            payload.username.reuseUserName = true;
        }
        return this._http.post<MicroservicesResponse<CustomerValidateResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.VALIDATE_CUSTOMER_INFO}`, payload, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    validateUserName(payload: UserNameValidation, allowErrorHandler: boolean = true): Observable<CustomerValidateResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        if (payload) {
            payload.reuseUserName = true;
        }
        return this._http.post<MicroservicesResponse<CustomerValidateResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.VALIDATE_UNIQUE_LOGIN}`, payload, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    validatePassword(password: string, allowErrorHandler: boolean = true): Observable<PasswordValidateResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http.post<MicroservicesResponse<PasswordValidateResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.VALIDATE_PASSWORD}`, { value: password }, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
