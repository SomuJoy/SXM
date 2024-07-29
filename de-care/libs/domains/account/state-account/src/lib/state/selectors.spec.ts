import { getAccountRadioService, getAccountVehicleInfo, selectAccount } from './selectors';
import { Mock } from 'ts-mockery';
import { Account } from '../data-services/account.interface';

describe('account selectors', () => {
    it('should return account value from state', () => {
        const mockAccount = Mock.of<Account>({});
        expect(selectAccount.projector({ account: mockAccount })).toBe(mockAccount);
    });

    describe('getAccountRadioService', () => {
        it('should return null if subscription is null or undefined', () => {
            expect(getAccountRadioService.projector(null)).toBe(null);
            expect(getAccountRadioService.projector(undefined)).toBe(null);
        });
        it('should return radio service if subscription has radio service', () => {
            const mockRadioService = {};
            expect(getAccountRadioService.projector({ radioService: mockRadioService })).toBe(mockRadioService);
        });
    });

    describe('getAccountVehicleInfo', () => {
        it('should return null if radio service is null or undefined', () => {
            expect(getAccountVehicleInfo.projector(null)).toBe(null);
            expect(getAccountVehicleInfo.projector(undefined)).toBe(null);
        });
        it('should return vehicle info if radio service has vehicle info', () => {
            const mockVehicleInfo = {};
            expect(getAccountVehicleInfo.projector({ vehicleInfo: mockVehicleInfo })).toBe(mockVehicleInfo);
        });
    });
});
