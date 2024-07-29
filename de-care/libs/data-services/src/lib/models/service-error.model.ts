import { ErrorTypeEnum } from '../enums/error-type.enum';

export interface MicroserviceErrorModel {
    errorCode: string;
    errorPropKey: string;
    errorType: ErrorTypeEnum;
    errorStackTrace?: string;
    fieldErrors?: Array<BusinessErrorModel>;
}

export interface BusinessErrorModel {
    errorCode: string;
    errorPropKey: string;
    errorType: ErrorTypeEnum;
    fieldName: string;
}