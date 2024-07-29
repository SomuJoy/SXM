import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { DataDevicesService, DataDeviceInfoModel, VehicleModel } from '@de-care/data-services';
import { cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { Mock } from 'ts-mockery';
import { VehicleInfoResolver } from './vehicle-info.resolver';
import { Store } from '@ngrx/store';

describe('VehicleInfoResolver', () => {
    describe('positive scenarios', () => {
        it('should call DataDevicesService service', () => {
            const mockDataDeviceService = Mock.of<DataDevicesService>({ info: () => of() });
            const mockStore = Mock.of<Store>({ pipe: () => of({}) });
            const resolver = new VehicleInfoResolver(new UrlHelperService(), mockDataDeviceService, mockStore);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({
                queryParamMap: convertToParamMap({ radioid: '12345678' })
            });
            const result = resolver.resolve(mockActivatedRouteSnapshot);
            expect(mockDataDeviceService.info).toHaveBeenCalled();
        });
        it('should return Vehicle Info if data returns vehicle info from DataDevicesService', () => {
            const mockVehicle: VehicleModel = {
                year: 1997,
                make: 'Ford',
                model: 'Festiva'
            };
            const mockDeviceResponse: DataDeviceInfoModel = { deviceInformation: { radioId: '1234', deviceStatus: '', vehicle: mockVehicle } };
            const mockDataDeviceService = Mock.of<DataDevicesService>({ info: () => of(mockDeviceResponse) });
            const mockStore = Mock.of<Store>({ pipe: () => of({}) });
            const resolver = new VehicleInfoResolver(new UrlHelperService(), mockDataDeviceService, mockStore);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({
                queryParamMap: convertToParamMap({ radioid: '12345678' })
            });
            const result = resolver.resolve(mockActivatedRouteSnapshot);
            expect(result).toBeObservable(cold('(a|)', { a: mockVehicle }));
        });
        it('should return null if DataDevicesService returns error', () => {
            const mockError = { error: { status: '000' } };
            const mockDataDeviceService = Mock.of<DataDevicesService>({ info: () => throwError(mockError) });
            const mockStore = Mock.of<Store>({ pipe: () => of({}) });
            const resolver = new VehicleInfoResolver(new UrlHelperService(), mockDataDeviceService, mockStore);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({
                queryParamMap: convertToParamMap({ radioid: '12345678', usedCarBrandingType: 'TEST_BRANDING_TYPE' })
            });
            const result = resolver.resolve(mockActivatedRouteSnapshot);
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('(a|)', { a: null }));
        });
    });

    describe('negative scenarios', () => {
        it('should return null if blank radioid url param is provided', () => {
            const mockDataDeviceService = Mock.of<DataDevicesService>({ info: () => of() });
            const mockStore = Mock.of<Store>({ pipe: () => of({}) });
            const resolver = new VehicleInfoResolver(new UrlHelperService(), mockDataDeviceService, mockStore);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({
                queryParamMap: convertToParamMap({ radioid: '' })
            });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('(a|)', { a: null }));
        });

        it('should return null if no radioid url param is provided', () => {
            const mockDataDeviceService = Mock.of<DataDevicesService>({ info: () => of() });
            const mockStore = Mock.of<Store>({ pipe: () => of({}) });
            const resolver = new VehicleInfoResolver(new UrlHelperService(), mockDataDeviceService, mockStore);
            const mockActivatedRouteSnapshot = Mock.of<ActivatedRouteSnapshot>({
                queryParamMap: convertToParamMap({})
            });
            expect(resolver.resolve(mockActivatedRouteSnapshot)).toBeObservable(cold('(a|)', { a: null }));
        });
    });
});
