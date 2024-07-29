import { getAllNonDataCapableOffersAsArray, selectOffer } from './offer.selectors';
import { Mock } from 'ts-mockery';
import { Offer } from '../../data-services/offer.interface';

describe('offer selectors', () => {
    it('should return offer value from state', () => {
        const mockOfferModel = Mock.of<Offer>();
        expect(selectOffer.projector({ offers: [mockOfferModel] })).toBe(mockOfferModel);
    });

    describe('getAllNonDataCapableOffersAsArray', () => {
        it('should return empty array when offers in state are null', () => {
            const mockOffers = null;
            const result = getAllNonDataCapableOffersAsArray.projector(mockOffers);
            expect(Array.isArray(result)).toBe(true);
        });
    });
});
