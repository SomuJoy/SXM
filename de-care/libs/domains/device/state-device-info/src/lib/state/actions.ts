import { createAction, props } from '@ngrx/store';
import { DeviceInfoRequestModel, DeviceInfoModelResponse } from '../data-services/device-info.service';

export const getDeviceInfo = createAction('[Device Info] Get device info', props<DeviceInfoRequestModel>());
export const setDeviceInfoData = createAction('[Device Info] Set device info', props<DeviceInfoModelResponse>());
export const loadDeviceInfoDataError = createAction('[Device Info] Load device info Error');
