import { Mock } from 'ts-mockery';
import { getFirstOffer } from './helpers';
import { Offer } from './offer.interface';

describe('data service offer helpers', () => {
    describe('getFirstOffer', () => {
        it('should return null when offer model is null', () => {
            expect(getFirstOffer(null)).toBe(null);
        });
        it('should return null when offer model has empty array', () => {
            const mockOffer = Mock.of<Offer[]>([]);
            expect(getFirstOffer(mockOffer)).toBe(null);
        });
        it('should return offer when offer model has 1 offer', () => {
            const mockPackage = Mock.of<Offer>({});
            const mockOffer = Mock.of<Offer[]>([mockPackage]);
            expect(getFirstOffer(mockOffer)).toBe(mockPackage);
        });
        it('should return the first offer when offer model has more than 1 offer', () => {
            const mockPackageFirst = Mock.of<Offer>({});
            const mockPackageSecond = Mock.of<Offer>({});
            const mockOffer = Mock.of<Offer[]>([mockPackageFirst, mockPackageSecond]);
            expect(getFirstOffer(mockOffer)).toBe(mockPackageFirst);
        });
    });
});
