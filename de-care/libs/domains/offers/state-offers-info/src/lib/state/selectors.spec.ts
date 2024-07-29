import { selectOfferInfoLegalCopyByPlanCode, getCurrentLocale, selectOfferInfoByPlanCode, selectOfferInfoSalesHeroCopyByPlanCode } from './state.selectors';

describe('offer info selectors', () => {
    describe('getCurrentLocale', () => {
        it('should return the current locale as string', () => {
            const result = getCurrentLocale.projector({ currentLocale: 'en_US' });
            expect(result).toBe('en_US');
        });
    });

    describe('selectOfferInfoByPlanCode', () => {
        it('should return offer info that matches planCode and locale', () => {
            const result = selectOfferInfoByPlanCode('abc').projector('en_US', { 'abc | en_US': { planCode: 'abc', locale: 'en_US' } });
            expect(result).toEqual({ planCode: 'abc', locale: 'en_US' });
        });
        it('should return null when no offer info is found that matches planCode and locale', () => {
            const result = selectOfferInfoByPlanCode('abc').projector('en_CA', { 'abc | en_US': { planCode: 'abc', locale: 'en_US' } });
            expect(result).toBe(null);
        });
    });

    describe('selectOfferInfoLegalCopyByPlanCode', () => {
        it('should return legal copy from offer info that matches planCode and locale', () => {
            const result = selectOfferInfoLegalCopyByPlanCode('abc').projector('en_US', { 'abc | en_US': { planCode: 'abc', locale: 'en_US', offerDetails: 'legal copy' } });
            expect(result).toEqual('legal copy');
        });
        it('should return empty array if there is no legal copy from offer info that matches planCode and locale', () => {
            const result = selectOfferInfoLegalCopyByPlanCode('abc').projector('en_US', { 'abc | en_US': { planCode: 'abc', locale: 'en_US' } });
            expect(result).toEqual('');
        });
    });

    describe('selectOfferInfoSalesHeroCopyByPlanCode', () => {
        it('should return sales hero from offer info that matches planCode and locale', () => {
            const result = selectOfferInfoSalesHeroCopyByPlanCode('abc').projector('en_US', {
                'abc | en_US': { planCode: 'abc', locale: 'en_US', salesHero: { title: 'test' } }
            });
            expect(result).toEqual({ title: 'test' });
        });
        it('should return null if there is no offer info that matches planCode and locale', () => {
            const result = selectOfferInfoSalesHeroCopyByPlanCode('def').projector('en_US', { 'abc | en_US': { planCode: 'abc', locale: 'en_US' } });
            expect(result).toEqual(null);
        });
    });
});
