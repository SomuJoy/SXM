export interface NuCaptchaNewRequestModel {
    placement?: string;
}

export interface NuCaptchaValidateRequestModel {
    answer: string;
    token: string;
}

export interface NuCaptchaNewResponseModel {
    captcha: string;
}

export interface NuCaptchaValidateResponseModel {
    isValidCaptcha: boolean;
}

export interface MicroservicesResponse<T> {
    status: string;
    httpStatusCode: string;
    httpStatus: string;
    data: T;
}
