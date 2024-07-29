import { selectChangeSubscriptionOffers } from './change-subscription-offers.selectors';

describe('change subscription offers selectors', () => {
    it('should return object with upgrade offers and other offers from state', () => {
        const mockOffers = [{ upgradeOffer: false }, { upgradeOffer: false }, { upgradeOffer: true }];
        const result = selectChangeSubscriptionOffers.projector(mockOffers);
        expect(result.upgrades.length).toBe(1);
        expect(result.other.length).toBe(2);
    });
    it('should return object with empty array for upgrade offers and 1 other offers from state when offers in state only contain non upgrade offers', () => {
        const mockOffers = [{ upgradeOffer: false }];
        const result = selectChangeSubscriptionOffers.projector(mockOffers);
        expect(result.upgrades.length).toBe(0);
        expect(result.other.length).toBe(1);
    });
    it('should return object with 1 upgrade offers and empty array for other offers from state when offers in state only contain upgrade offers', () => {
        const mockOffers = [{ upgradeOffer: true }];
        const result = selectChangeSubscriptionOffers.projector(mockOffers);
        expect(result.upgrades.length).toBe(1);
        expect(result.other.length).toBe(0);
    });
});
