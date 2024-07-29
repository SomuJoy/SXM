import { Injectable } from '@angular/core';
import { EventErrorModel, FrontEndErrorModel } from './models';
import { DataLayerDataTypeEnum, ErrorTypeEnum } from './enums';
import { DataLayerService } from './legacy-data-layer/data-layer.service';

@Injectable({ providedIn: 'root' })
export class LegacyDataLayerService {
    constructor(private readonly _dataLayerService: DataLayerService) {}

    public pageTrack(pageKey: string, componentKey: string): void {
        this._dataLayerService.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentKey, { flowName: pageKey, componentName: componentKey });
    }

    public componentTrack(componentName: string): void {
        this._dataLayerService.updateAndSendComponentTrack(DataLayerDataTypeEnum.PageInfo, { componentName: componentName });
    }

    public setPageFlowName(pageKey: string): void {
        this._dataLayerService.setDigitalDataProps(DataLayerDataTypeEnum.PageInfo, { flowName: pageKey });
    }

    public eventTrack(event: string, data: any): void {
        this._dataLayerService.setDigitalDataProps(event, data);
    }

    public getData(dataType: DataLayerDataTypeEnum) {
        return this._dataLayerService.getData(dataType);
    }

    public eventTrackWithDataLayerUpdate(dataLayerKeyToUpdate: string, dataLayerPayloadToUpdate: any, eventAction: string, eventData: any): void {
        this._dataLayerService.setDigitalDataProps(dataLayerKeyToUpdate, dataLayerPayloadToUpdate);
        this._dataLayerService.sendExplicitEventTrackEvent(eventAction, eventData);
    }

    public explicitEventTrack(eventAction, eventData) {
        this._dataLayerService.sendExplicitEventTrackEvent(eventAction, eventData);
    }

    public errorTrack(error: any): void {
        this._dataLayerService.buildErrorInfo(error);
    }

    public frontEndErrorTrack(message: string): void {
        const error = new FrontEndErrorModel(ErrorTypeEnum.User, message);
        this._dataLayerService.buildErrorInfo(error);
    }

    public businessErrorTrack(message: string): void {
        const error = new EventErrorModel(ErrorTypeEnum.Business, message);
        this._dataLayerService.buildErrorInfo(error);
    }

    public httpCallErrorTrack(error): void {
        this._dataLayerService.buildErrorInfo(error);
    }

    public appErrorTrack(error): void {
        this._dataLayerService.buildErrorInfo(error);
    }
}
