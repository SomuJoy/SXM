import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DataLayerModel, AnalyticsFlowComponentModel, DataLayerDataTypeEnum, MicroserviceErrorModel, CustomerInfoData, AnalyticsComponentModel } from '@de-care/data-services';
import { CoreLoggerService } from './logs/console-logger.service';
import { ServiceErrorModel, FrontEndErrorModel, EventErrorModel } from './data-layer.model';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { DataTrackerService } from '@de-care/shared/data-tracker';

@Injectable({
    providedIn: 'root',
})
export class DataLayerService {
    protected _logPrefix: string = '[DataLayerService]:';

    private dataLayer: DataLayerModel = { isReady: false };

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

    constructor(
        private _dataTrackerService: DataTrackerService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private readonly _logger: CoreLoggerService,
        @Inject(DOCUMENT) document: Document
    ) {
        // We might already have a window.digitalData
        // If it exists, reuse that object reference, otherwise create it
        if (document.defaultView['digitalData']) {
            Object.assign(document.defaultView['digitalData'], this.dataLayer); // copy props
            // todo: look into if this line is causing an err when this line of code is hit at run time
            this.dataLayer = document.defaultView['digitalData']; // reassign
        } else {
            document.defaultView['digitalData'] = this.dataLayer;
        }

        this._logger.info(`${this._logPrefix} dataLayer object 'window.digitalData' has been initiated.`);
        this._listenForProvince();
        this._listenForLanguage();
    }

    public sendEventTrackEvent(dataType: string): void {
        if (this.dataLayer.isReady) {
            this._dataTrackerService.trackEvent(dataType + 'DataReady', { dataType: dataType });
        }
    }

    public sendExplicitEventTrackEvent(action: string, data: any): void {
        if (this.dataLayer.isReady) {
            this._dataTrackerService.trackEvent(action, data);
        }
    }

    public sendPageTrackEvent(payload: any): void {
        if (this.dataLayer.isReady) {
            this._dataTrackerService.trackPage(payload);
        }
    }

    public updateAndSendPageTrackEvent(dataType: string, pageType: string, payload: AnalyticsFlowComponentModel) {
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

    public updateAndSendComponentTrack(dataType: string, componentName: AnalyticsComponentModel) {
        const pageObj = this.getData(dataType) || {};
        pageObj['componentName'] = componentName.componentName;

        this.setDigitalDataProps(dataType, pageObj);

        this.sendPageTrackEvent({
            flowName: pageObj.flowName,
            componentName: componentName,
        });
    }

    public update(dataType: string, payload: any) {
        if (dataType && payload) {
            dataType = this.toInitialLowerCase(dataType);
            this.dataLayer[dataType] = payload;
            this.dataLayer.isReady = true; // TODO: examine how to determine timing of `isReady`
            this._logger.debug(`${this._logPrefix} updated dataLayer object 'digitalData' -> dataType:'` + dataType + `', data: `, payload);
        }
    }

    public setDigitalDataProps(key: string, payload: any) {
        if (key && payload) {
            key = this.toInitialLowerCase(key);

            this._updateValuesInKey(this.dataLayer, key, payload);

            this.dataLayer.isReady = true; // TODO: examine how to determine timing of `isReady`

            this._logger.debug(`${this._logPrefix} modified dataLayer object 'digitalData' -> dataType:'` + key + `', data: `, payload);
        }
    }

    public getData(attribute: string) {
        if (this.dataLayer.isReady && this.dataLayer[attribute]) {
            return this.dataLayer[attribute];
        }
        return attribute === DataLayerDataTypeEnum.ErrorInfo ? { nextSequence: 1 } : {};
    }

    public setCustomerInfoToNewAccount(isStreaming: boolean): void {
        const customerInfoObj: CustomerInfoData = this.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        customerInfoObj.customerType = isStreaming ? 'NEW_SXIR_ACCOUNT' : 'NEW_ACCOUNT';
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

    public updatePageInfo(dataType: string, pageType: string, payload: AnalyticsFlowComponentModel) {
        const pageObj = this.getData(dataType) || {};
        pageObj[pageType] = payload;
        pageObj['flowName'] = payload.flowName;
        pageObj['componentName'] = payload.componentName;
        pageObj['subscriptionCount'] = payload.subscriptionCount;

        this.update(dataType, pageObj);
    }

    public updateLanguage(lang): void {
        const dataType = DataLayerDataTypeEnum.CustomerInfo;
        const customerInfo: CustomerInfoData = this.getData(dataType);

        if (lang) {
            const updatedCustomerInfo: CustomerInfoData = {
                ...customerInfo,
                language: lang,
            };
            this.update(dataType, updatedCustomerInfo);
        }
    }

    private _listenForProvince(): void {
        this._userSettingsService.selectedCanadianProvince$.subscribe((province) => {
            const dataType = DataLayerDataTypeEnum.CustomerInfo;
            const customerInfo: CustomerInfoData = this.getData(dataType);

            if (province) {
                const updatedCustomerInfo: CustomerInfoData = {
                    ...customerInfo,
                    location: province,
                };
                this.update(dataType, updatedCustomerInfo);
            }
        });
    }

    private _listenForLanguage(): void {
        this._translateService.onLangChange.subscribe((langObj) => {
            if (langObj) {
                this.updateLanguage(langObj.lang);
            }
        });
    }
}
