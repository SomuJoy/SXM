import { createReducer, createFeatureSelector, on } from '@ngrx/store';
import { VehicleModel } from '../data-services/device-info.service';
import { setDeviceInfoData } from './actions';

export const featureKey = 'deviceInfo';
export const selectFeature = createFeatureSelector<DeviceInfoState>(featureKey);

export interface DeviceInfoState {
    radioId: string;
    deviceStatus: string;
    primaryBrandId: string;
    primaryDealerId: string;
    secondaryBrandId: string;
    secondaryDealerId: string;
    vehicle: VehicleModel;
    service: string;
}

export const initialState: DeviceInfoState = {
    radioId: null,
    deviceStatus: null,
    primaryBrandId: null,
    primaryDealerId: null,
    secondaryBrandId: null,
    secondaryDealerId: null,
    vehicle: null,
    service: null
};

export const deviceInfoReducer = createReducer(
    initialState,
    on(setDeviceInfoData, (state, { deviceInformation }) => ({ ...state, ...deviceInformation }))
);

export function getDeviceInfoReducer(state, action) {
    return deviceInfoReducer(state, action);
}
