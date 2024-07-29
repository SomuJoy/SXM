export interface MicroservicesResponse<T> {
    data: T;
}

export type MicroservicesResponseErrorTypes = 'SYSTEM' | 'BUSINESS';

export interface MicroservicesResponseErrorModel<ActionErrorCodes, FieldErrorCodes> {
    error: {
        error: MicroservicesError<ActionErrorCodes, FieldErrorCodes>;
    };
}

export interface MicroservicesError<ActionErrorCodes, FieldErrorCodes> {
    errorType: MicroservicesResponseErrorTypes;
    errorCode: ActionErrorCodes;
    fieldErrors: MicroservicesFieldError<FieldErrorCodes>[];
}

export interface MicroservicesFieldError<FieldErrorCodes> {
    errorType: MicroservicesResponseErrorTypes;
    errorCode: FieldErrorCodes;
}
