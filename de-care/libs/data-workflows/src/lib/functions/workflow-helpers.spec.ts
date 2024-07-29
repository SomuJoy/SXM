import { AccountModel } from '@de-care/data-services';
import { getDevicePromoCode } from './workflow-helpers';

describe('Get Device PromoCode function', () => {
    it('should return device promo code from subscription', () => {
        const mockAccountWithSubscription = { closedDevices: [], subscriptions: [{ devicePromoCode: '1204' }] } as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe('1204');
    });

    it('should return device promo code from closed device', () => {
        const mockAccountWithSubscription = { subscriptions: [], closedDevices: [{ subscription: { devicePromoCode: '1204', status: 'Closed' } }] } as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe('1204');
    });

    it('should return null', () => {
        const mockAccountWithSubscription = null as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe(null);
    });

    it('should return null for empty account', () => {
        const mockAccountWithSubscription = {} as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe(null);
    });

    it('should return null for no device promo code from subscription nor closed account', () => {
        const mockAccountWithSubscription = { closedDevices: [], subscriptions: [] } as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe(null);
    });

    it('should return null for no device promo code from closed device nor subscriptions', () => {
        const mockAccountWithSubscription = { subscriptions: [], closedDevices: [{ subscription: { status: 'Closed' } }] } as AccountModel;
        expect(getDevicePromoCode(mockAccountWithSubscription)).toBe(null);
    });
});
