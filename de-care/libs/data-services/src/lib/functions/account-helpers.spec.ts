import { AccountModel } from '../models/account.model';
import { ClosedDeviceModel } from '../models/closeddevice.model';
import { getFirstSubscriptionOrClosedDeviceStatus } from './account-helpers';
import { SubscriptionModel } from '../models/subscription.model';
import { Mock } from 'ts-mockery';

describe('account helpers functions', () => {
    describe('getFirstSubscriptionOrClosedDeviceStatus', () => {
        describe('With or without Radio ID', () => {
            it('should return a string in all cases', () => {
                const mockEmptyAccount: AccountModel = { closedDevices: [], subscriptions: [] } as AccountModel;
                expect(getFirstSubscriptionOrClosedDeviceStatus({} as AccountModel, '')).toBe('');
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockEmptyAccount, '')).toBe('');
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockEmptyAccount as AccountModel, '1234')).toBe('');
            });
        });

        describe('With Radio ID', () => {
            it('should return the status of the first subscription or closed device', () => {
                const mockSubs = Mock.of<SubscriptionModel[]>([{ radioService: { last4DigitsOfRadioId: '1234' }, status: 'Closed' }]);
                const mockClosed = Mock.of<ClosedDeviceModel[]>([{ last4DigitsOfRadioId: '1234', subscription: { status: 'Active' } }]);
                const mockAccountWithClosed: AccountModel = Mock.of<AccountModel>({ closedDevices: mockClosed, subscriptions: [{}, {}] });
                const mockAccountWithSub: AccountModel = Mock.of<AccountModel>({ closedDevices: [{}, {}], subscriptions: mockSubs });
                const mockAccount: AccountModel = Mock.of<AccountModel>({ closedDevices: mockClosed, subscriptions: mockSubs });

                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccountWithClosed, '1234')).toBe('Active');
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccountWithSub, '1234')).toBe('Closed');
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccount, '1234')).toBe('Closed');
            });

            it('should return the status of the first matching subscription before returning the status of the first subscription in the first closed device', () => {
                const mockSubs = Mock.of<SubscriptionModel[]>([{ radioService: { last4DigitsOfRadioId: '1234' }, status: 'Closed' }]);
                const mockClosed = Mock.of<ClosedDeviceModel[]>([{ last4DigitsOfRadioId: '1234', subscription: { status: 'Active' } }]);
                const mockAccountWithBoth: AccountModel = Mock.of<AccountModel>({ closedDevices: mockClosed, subscriptions: mockSubs });
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccountWithBoth, '1234')).toBe('Closed');
            });
        });

        describe('Without Radio ID', () => {
            it('should return the status of the first subscription or closed device', () => {
                const mockSubs = Mock.of<SubscriptionModel[]>([{ status: 'Closed' }]);
                const mockClosed = Mock.of<ClosedDeviceModel[]>([{ subscription: { status: 'Active' } }]);
                const mockAccount: AccountModel = Mock.of<AccountModel>({ closedDevices: mockClosed, subscriptions: mockSubs });

                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccount, '')).toBe('Closed');
            });

            it('should return the status of the first subscription before returning the status of the first subscription in the first closed device', () => {
                const mockSubs = Mock.of<SubscriptionModel[]>([{ radioService: { last4DigitsOfRadioId: '' }, status: 'Closed' }]);
                const mockClosed = Mock.of<ClosedDeviceModel[]>([{ last4DigitsOfRadioId: '', subscription: { status: 'Active' } }]);
                const mockAccountWithBoth: AccountModel = Mock.of<AccountModel>({ closedDevices: mockClosed, subscriptions: mockSubs });
                expect(getFirstSubscriptionOrClosedDeviceStatus(mockAccountWithBoth, '')).toBe('Closed');
            });
        });
    });
});
