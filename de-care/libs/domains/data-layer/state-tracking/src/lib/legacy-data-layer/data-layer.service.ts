import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DataTrackerService } from '@de-care/shared/data-tracker';
import { DataLayerDataTypeEnum } from '../enums';
import { EventErrorModel, FrontEndErrorModel, ServiceErrorModel } from '../models';
import { CustomerTypeEnum, MicroserviceErrorModel } from './models';

@Injectable({
    providedIn: 'root',
})
export class DataLayerService {
    private get dataLayer() {
        return this._document?.defaultView?.['digitalData'];
    }

    private _updateValuesInKey(obj: any, key: string, value: any) {
        if (obj[key] === undefined) {
            obj[key] = value;
        } else if (value !== null && typeof value === 'object') {
            Object.keys(value).forEach((propName) => {
                if (value[propName] !== null && typeof value[propName] === 'object') {
                    this._updateValuesInKey(obj[key], propName, value[propName]);
                } else {
                    obj[key][propName] = value[propName];
                }
            });
        } else {
            obj[key] = value;
        }
    }

    constructor(private _dataTrackerService: DataTrackerService, @Inject(DOCUMENT) private readonly _document: Document) {
        if (!this._document.defaultView['digitalData']) {
            this._document.defaultView['digitalData'] = {};
        }
    }

    public sendEventTrackEvent(dataType: string): void {
        this._dataTrackerService.trackEvent(dataType + 'DataReady', { dataType: dataType });
    }

    public sendExplicitEventTrackEvent(action: string, data: any): void {
        this._dataTrackerService.trackEvent(action, data);
    }

    public sendPageTrackEvent(payload: any): void {
        this._dataTrackerService.trackPage(payload);
    }

    public updateAndSendPageTrackEvent(
        dataType: string,
        pageType: string,
        payload: {
            flowName: string;
            componentName: string;
            subscriptionCount?: number;
        }
    ) {
        const pageObj = this.getData(dataType) || {};
        pageType = pageType.replace(':', '_');
        // todo: confirm it is okay to delete commented out lines below
        // pageType = this.toInitialLowerCase(pageType);

        // pageObj[pageType] = payload;
        pageObj['flowName'] = payload.flowName;
        pageObj['componentName'] = payload.componentName;

        // Remember to update the `excludedRoutes` property in Angulartics (app.module) otherwise there will be duplicate tracking
        this.setDigitalDataProps(dataType, pageObj);
        this.sendPageTrackEvent(payload);
    }

    public updateAndSendComponentTrack(
        dataType: string,
        componentName: {
            componentName: string;
        }
    ) {
        const pageObj = this.getData(dataType) || {};
        pageObj['componentName'] = componentName.componentName;

        this.setDigitalDataProps(dataType, pageObj);

        this.sendPageTrackEvent({
            flowName: pageObj.flowName,
            componentName: componentName,
        });
    }

    public update(dataType: string, payload: any) {
        if (dataType && payload && this.dataLayer?.[dataType]) {
            dataType = this.toInitialLowerCase(dataType);
            this.dataLayer[dataType] = payload;
        }
    }

    public setDigitalDataProps(key: string, payload: any) {
        if (key && payload && this.dataLayer) {
            key = this.toInitialLowerCase(key);

            this._updateValuesInKey(this.dataLayer, key, payload);
        }
    }

    public getData(attribute: string) {
        if (this.dataLayer?.[attribute]) {
            return this.dataLayer[attribute];
        }
        return attribute === DataLayerDataTypeEnum.ErrorInfo ? { nextSequence: 1 } : {};
    }

    public setCustomerInfoToNewAccount(isStreaming: boolean): void {
        const customerInfoObj = this.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        customerInfoObj.customerType = isStreaming ? CustomerTypeEnum.NewSxirAccount : CustomerTypeEnum.NewAccount;
        this.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }

    private toInitialLowerCase(data: string): string {
        data = data.charAt(0).toLowerCase() + data.slice(1);
        return data;
    }

    private _buildActionError(microserviceErrorObj: MicroserviceErrorModel, errorInfoObj: any): any {
        const serviceErrors: Array<ServiceErrorModel> = errorInfoObj.serviceError || new Array<ServiceErrorModel>();
        // Action error
        const errorInfoObjProp: any = {};
        errorInfoObjProp[microserviceErrorObj.errorPropKey] = microserviceErrorObj.errorStackTrace;
        serviceErrors.push(new ServiceErrorModel(microserviceErrorObj.errorType, errorInfoObjProp, errorInfoObj.nextSequence++));
        errorInfoObj.serviceError = serviceErrors;

        return errorInfoObj;
    }

    private _buildFieldError(microserviceErrorObj: MicroserviceErrorModel, errorInfoObj: any): any {
        const serviceErrors: Array<ServiceErrorModel> = errorInfoObj.serviceError || new Array<ServiceErrorModel>();
        // Field error
        microserviceErrorObj.fieldErrors.forEach((fieldError: any) => {
            const errorInfoObjProp: any = {};
            errorInfoObjProp[fieldError.errorPropKey] = { errorCode: fieldError.errorCode, fieldName: fieldError.fieldName };
            serviceErrors.push(new ServiceErrorModel(fieldError.errorType, errorInfoObjProp, errorInfoObj.nextSequence++));
        });
        errorInfoObj.serviceError = serviceErrors;

        return errorInfoObj;
    }

    public buildErrorInfo(errorObj: HttpErrorResponse | Error | FrontEndErrorModel | EventErrorModel): void {
        const errorInfoObj: any = this.getData(DataLayerDataTypeEnum.ErrorInfo);
        const frontEndError: FrontEndErrorModel = errorObj instanceof FrontEndErrorModel ? errorObj : null;
        const eventError: EventErrorModel = errorObj instanceof EventErrorModel ? errorObj : null;
        const appError: Error = errorObj instanceof Error ? errorObj : null;
        const serviceError: HttpErrorResponse = errorObj instanceof HttpErrorResponse ? errorObj : null;

        if (serviceError && serviceError.error && serviceError.error.error) {
            const microserviceErrorObj: MicroserviceErrorModel = serviceError.error.error;

            if (microserviceErrorObj.errorPropKey && microserviceErrorObj.errorStackTrace) {
                // Action error
                this._buildActionError(microserviceErrorObj, errorInfoObj);
            } else if (microserviceErrorObj.fieldErrors && microserviceErrorObj.fieldErrors.length > 0) {
                // Field error
                this._buildFieldError(microserviceErrorObj, errorInfoObj);
            }
        } else if (appError && appError.message) {
            // Not covered in the FRD
            const frontEndErrors: Array<FrontEndErrorModel> = errorInfoObj.frontEndError || new Array<FrontEndErrorModel>();
            frontEndErrors.push(new FrontEndErrorModel('APPLICATION', appError.message, errorInfoObj.nextSequence++));
            errorInfoObj.frontEndError = frontEndErrors;
        } else if (frontEndError) {
            const frontEndErrors: Array<FrontEndErrorModel> = errorInfoObj.frontEndError || new Array<FrontEndErrorModel>();
            frontEndErrors.push(new FrontEndErrorModel(frontEndError.errorType, frontEndError.errorName, errorInfoObj.nextSequence++));
            errorInfoObj.frontEndError = frontEndErrors;
        } else if (eventError) {
            const eventErrors: Array<EventErrorModel> = errorInfoObj.eventError || new Array<EventErrorModel>();
            eventErrors.push(new EventErrorModel(eventError.errorType, eventError.errorName, errorInfoObj.nextSequence++));
            errorInfoObj.eventError = eventErrors;
        }

        this.update(DataLayerDataTypeEnum.ErrorInfo, errorInfoObj);
    }

    public updatePageInfo(
        dataType: string,
        pageType: string,
        payload: {
            flowName: string;
            componentName: string;
            subscriptionCount?: number;
        }
    ) {
        const pageObj = this.getData(dataType) || {};
        pageObj[pageType] = payload;
        pageObj['flowName'] = payload.flowName;
        pageObj['componentName'] = payload.componentName;
        pageObj['subscriptionCount'] = payload.subscriptionCount;

        this.update(dataType, pageObj);
    }

    public updateLanguage(lang): void {
        const dataType = DataLayerDataTypeEnum.CustomerInfo;
        const customerInfo = this.getData(dataType);

        if (lang) {
            const updatedCustomerInfo = {
                ...customerInfo,
                language: lang,
            };
            this.update(dataType, updatedCustomerInfo);
        }
    }
}
