import { RefreshInstructionModelRequest } from '../models/refresh-instruction.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { RefreshModelRequest } from '../models/refresh.model';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DeviceValidateRequestModel } from '../models/devices.model';
import { RadioModel } from '../models/radio.model';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { DataDeviceInfoModel, DeviceInfoRequestModel } from '../models/device-info.model';

@Injectable({ providedIn: 'root' })
export class DataDevicesService {
    private url: string;
    private validateUrl: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    refresh(params: RefreshModelRequest): Observable<boolean> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<boolean>>(`${this.url}${ENDPOINTS_CONSTANTS.DEVICE_REFRESH}`, params, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }

    sendRefreshInstruction(params: RefreshInstructionModelRequest): Observable<MicroservicesResponse<{}>> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<{}>>(`${this.url}${ENDPOINTS_CONSTANTS.DEVICE_REFRESH_INSTRUCTION}`, params, options).pipe(
            tap(response => {
                // In cases of known errors, the server returns HTTP status code 200 but there is an error in the "status" field in the response
                if (response.status !== 'SUCCESS') {
                    throw new Error();
                }
            })
        );
    }

    /**
     * @deprecated Use workflow/action from @de-care/domains/device/state-device-info
     */
    info(params: DeviceInfoRequestModel): Observable<DataDeviceInfoModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<DataDeviceInfoModel>>(`${this.url}${ENDPOINTS_CONSTANTS.DEVICE_INFO}`, params, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }

    /**
     * @deprecated Use ValidateDeviceWorkflowService workflow from @de-care/domains/device/state-device-validate
     */
    validate(params: DeviceValidateRequestModel, allowErrorHandler: boolean = true): Observable<RadioModel> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
            }
        };
        return this._http.post<MicroservicesResponse<RadioModel>>(`${this.url}${ENDPOINTS_CONSTANTS.DEVICE_VALIDATE}`, params, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }
}
