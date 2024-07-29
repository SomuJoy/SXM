export enum CustomerTypeEnum {
    NewAccount = 'NEW_ACCOUNT',
    NewSxirAccount = 'NEW_SXIR_ACCOUNT',
}

export enum ErrorTypeEnum {
    System = 'SYSTEM',
    Business = 'BUSINESS',
    User = 'USER',
}

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

export class BaseErrorModel {
    public errorType: string;
    public sequence?: number;

    constructor(errType: string, seq?: number) {
        this.errorType = errType;
        this.sequence = seq;
    }
}

export class ServiceErrorModel extends BaseErrorModel {
    public errorDetails: any;

    constructor(errType: string, errorObj: any, seq?: number) {
        super(errType, seq);
        this.errorDetails = errorObj;
    }
}

export class FrontEndErrorModel extends BaseErrorModel {
    public errorName: string;

    constructor(errType: string, errName: string, seq?: number) {
        super(errType, seq);
        this.errorName = errName;
    }
}

export class EventErrorModel extends BaseErrorModel {
    public errorName: string;

    constructor(errType: string, errName: string, seq?: number) {
        super(errType, seq);
        this.errorName = errName;
    }
}
